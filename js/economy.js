// economy.js - Economy system for The Marvel Cave Mining Company
// Handles guano sales, contracts, payments, inflation, and expenses

window.Economy = {
  // Constants
  GUANO_PRICE_PER_TON: 700,        // Historical Marvel Cave wholesale figure
  MINER_SHARE_RATE: 0.10,          // Contract share paid to the crew lead
  SHIPPING_COST_PER_TON: 0,        // Company carries the freight risk
  PAYMENT_DELAY_DAYS: 5,            // 5-day payment delay
  BASE_INFLATION_RATE: 0.10,        // 10% per month
  WINTER_INFLATION_MULTIPLIER: 2,   // 2x inflation in winter

  // Store prices (base prices before inflation)
  basePrices: {
    food:       0.08,   // per lb
    lanternOil: 0.25,   // per gallon
    rope:       0.02    // per foot
  },

  getCompanyRate: function(state) {
    return state && state.companySalePrice ? state.companySalePrice : this.GUANO_PRICE_PER_TON;
  },

  getMinerShareRate: function(state) {
    return state && state.contractShareRate ? state.contractShareRate : this.MINER_SHARE_RATE;
  },

  getPayPerTon: function(state) {
    return Math.round(this.getCompanyRate(state) * this.getMinerShareRate(state) * 100) / 100;
  },

  getEffectivePayPerTon: function(state) {
    var payPerTon = this.getCompanyRate(state) * this.getMinerShareRate(state);
    var doctrine = window.Expedition && window.Expedition.getDoctrine
      ? window.Expedition.getDoctrine(state && state.expedition ? state.expedition.doctrine : null)
      : null;
    var foremanProfile = window.Expedition && window.Expedition.getCrewData
      ? window.Expedition.getCrewData(state, state ? state.foreman : null)
      : null;
    var profession = window.CaveData && window.CaveData.PROFESSIONS && state
      ? window.CaveData.PROFESSIONS[state.profession]
      : null;

    if (doctrine && doctrine.id === 'profit_first') payPerTon *= 1.05;
    if (foremanProfile && foremanProfile.traitId === 'ledger_eye') payPerTon *= 1.04;
    if (profession && profession.tradeBonus) payPerTon *= (1 + profession.tradeBonus);

    return Math.round(payPerTon * 100) / 100;
  },

  // Get current price with inflation applied
  getPrice: function(item, state) {
    var base = this.basePrices[item];
    if (base === undefined) return 0;
    return Math.round(base * state.inflationRate * 100) / 100;
  },

  // Get all current prices as an object
  getAllPrices: function(state) {
    var prices = {};
    for (var item in this.basePrices) {
      prices[item] = this.getPrice(item, state);
    }
    return prices;
  },

  // Update inflation based on time passage
  updateInflation: function(state, dayFraction) {
    dayFraction = typeof dayFraction === 'number' ? dayFraction : 1;
    // 10% per month base, doubled in winter
    var dailyRate = this.BASE_INFLATION_RATE / 30; // approximate daily inflation
    if (state.season === 'winter') {
      dailyRate *= this.WINTER_INFLATION_MULTIPLIER;
    }
    state.inflationRate += dailyRate * dayFraction;
  },

  // Purchase an item from the store
  // Returns { success, cost, message }
  purchase: function(item, quantity, state) {
    if (quantity <= 0) return { success: false, cost: 0, message: 'Invalid quantity.' };

    var unitPrice = this.getPrice(item, state);
    var totalCost = Math.round(unitPrice * quantity * 100) / 100;

    if (totalCost > state.cash) {
      return { success: false, cost: totalCost, message: 'Not enough cash. Need $' + totalCost.toFixed(2) + '.' };
    }

    // Deduct cash
    state.cash = Math.round((state.cash - totalCost) * 100) / 100;
    state.totalExpenses += totalCost;

    // Add item to inventory
    switch (item) {
      case 'food':       state.food += quantity; break;
      case 'lanternOil': state.lanternOil += quantity; break;
      case 'rope':       state.rope += quantity; break;
      default:
        // Refund if unknown item
        state.cash += totalCost;
        state.totalExpenses -= totalCost;
        return { success: false, cost: 0, message: 'Unknown item: ' + item };
    }

    return { success: true, cost: totalCost, message: 'Purchased ' + quantity + ' ' + item + ' for $' + totalCost.toFixed(2) + '.' };
  },

  // Ship guano and create a pending payment
  shipGuano: function(tons, state) {
    if (tons <= 0) return { success: false, message: 'Nothing to ship.' };
    if (tons > state.guanoStockpile) {
      return { success: false, message: 'Only ' + state.guanoStockpile.toFixed(1) + ' tons available.' };
    }

    var revenue = tons * this.getCompanyRate(state);
    var shippingCost = tons * this.SHIPPING_COST_PER_TON;
    var netRevenue = tons * this.getPayPerTon(state);

    // Deduct from stockpile
    state.guanoStockpile -= tons;
    state.guanoShipped += tons;

    // Pay shipping cost immediately
    state.cash -= shippingCost;
    state.totalExpenses += shippingCost;

    // Create pending payment with 14-day delay
    var dueDate = new Date(state.date.getTime() + (this.PAYMENT_DELAY_DAYS * 86400000));
    state.pendingPayments.push({
      amount: netRevenue,
      tons: tons,
      dueDate: dueDate,
      description: tons.toFixed(1) + ' tons guano'
    });

    return {
      success: true,
      revenue: revenue,
      shippingCost: shippingCost,
      netRevenue: netRevenue,
      dueDate: dueDate,
      message: 'Turned in ' + tons.toFixed(1) + ' tons. Your share of $' + netRevenue.toFixed(2) + ' is due in ' + this.PAYMENT_DELAY_DAYS + ' days.'
    };
  },

  // Process pending payments - call each day
  processPendingPayments: function(state) {
    var received = [];
    var remaining = [];

    for (var i = 0; i < state.pendingPayments.length; i++) {
      var payment = state.pendingPayments[i];
      if (state.date >= payment.dueDate) {
        // Payment arrives
        state.cash += payment.amount;
        state.totalRevenue += payment.amount;
        received.push(payment);
      } else {
        remaining.push(payment);
      }
    }

    state.pendingPayments = remaining;
    return received;
  },

  // Create a new contract
  createContract: function(target, bonusRate, deadline, state) {
    var contract = {
      target: target,           // tons required
      bonusRate: bonusRate,     // extra $ per ton if met
      deadline: deadline,       // Date object
      fulfilled: false,
      tonsDelivered: 0
    };
    state.contracts.push(contract);
    return contract;
  },

  // Check contracts and apply bonuses
  checkContracts: function(state) {
    var results = [];
    for (var i = 0; i < state.contracts.length; i++) {
      var contract = state.contracts[i];
      if (contract.fulfilled) continue;

      contract.tonsDelivered = state.guanoShipped;

      if (state.guanoShipped >= contract.target) {
        contract.fulfilled = true;
        var bonus = contract.target * contract.bonusRate;
        state.cash += bonus;
        state.totalRevenue += bonus;
        results.push({
          contract: contract,
          bonus: bonus,
          message: 'Contract fulfilled! Bonus: $' + bonus.toFixed(2)
        });
      } else if (state.date > contract.deadline) {
        // Contract expired unfulfilled
        results.push({
          contract: contract,
          bonus: 0,
          message: 'Contract expired! Needed ' + contract.target + ' tons, delivered ' + contract.tonsDelivered.toFixed(1) + '.'
        });
      }
    }
    return results;
  },

  // Calculate daily food consumption based on ration level and party size
  getFoodConsumption: function(state, dayFraction) {
    dayFraction = typeof dayFraction === 'number' ? dayFraction : 1;
    var partySize = window.GameState.getPartySize();
    var perPerson;

    switch (state.rationLevel) {
      case 'full':   perPerson = 2.4; break;  // ~12 lbs for 5
      case 'half':   perPerson = 1.2; break;  // ~6 lbs for 5
      case 'scraps': perPerson = 0.6; break;  // ~3 lbs for 5
      case 'none':   perPerson = 0;   break;
      default:       perPerson = 2.4; break;
    }

    return perPerson * partySize * dayFraction;
  },

  // Calculate daily oil consumption
  getOilConsumption: function(state, dayFraction) {
    if (!state.isUnderground) return 0;
    dayFraction = typeof dayFraction === 'number' ? dayFraction : 1;
    var amount = 0.5; // 0.5 gallons per day underground
    if (state.travelDay) {
      amount = 0.35;
    }
    if (window.Expedition && window.Expedition.modifyOilConsumption) {
      amount = window.Expedition.modifyOilConsumption(state, amount);
    }
    return amount * dayFraction;
  },

  // Consume daily resources, returns what was consumed and any shortages
  consumeDailyResources: function(state, dayFraction) {
    dayFraction = typeof dayFraction === 'number' ? dayFraction : 1;
    var result = { shortages: [] };

    // Food consumption
    var foodNeeded = Math.round(this.getFoodConsumption(state, dayFraction) * 100) / 100;
    if (foodNeeded <= 0) {
      result.foodConsumed = 0;
      if (state.food <= 0) {
        result.shortages.push('food');
        state.foodShortageDays = Math.round(((state.foodShortageDays || 0) + dayFraction) * 100) / 100;
      } else {
        state.foodShortageDays = 0;
      }
    } else if (state.food >= foodNeeded) {
      state.food = Math.round((state.food - foodNeeded) * 100) / 100;
      result.foodConsumed = foodNeeded;
      state.foodShortageDays = 0;
    } else {
      result.foodConsumed = state.food;
      result.shortages.push('food');
      state.food = 0;
      state.foodShortageDays = Math.round(((state.foodShortageDays || 0) + dayFraction) * 100) / 100;
      // Force ration level down
      if (state.rationLevel !== 'none') {
        if (state.food <= 0) state.rationLevel = 'none';
      }
    }

    // Oil consumption (only underground)
    if (state.isUnderground) {
      var oilNeeded = Math.round(this.getOilConsumption(state, dayFraction) * 100) / 100;
      if (state.lanternOil >= oilNeeded) {
        state.lanternOil = Math.round((state.lanternOil - oilNeeded) * 100) / 100;
        result.oilConsumed = oilNeeded;
      } else {
        result.oilConsumed = state.lanternOil;
        result.shortages.push('lanternOil');
        state.lanternOil = 0;
      }

    }

    return result;
  },

  // Get net worth summary
  settleFinalAccounts: function(state) {
    if (!state) return { autoSoldTons: 0, autoSoldPay: 0, pendingReleased: 0, addedCash: 0 };
    if (state.finalSettlement) return state.finalSettlement;

    var summary = {
      autoSoldTons: 0,
      autoSoldPay: 0,
      pendingReleased: 0,
      addedCash: 0
    };

    if (state.guanoStockpile > 0) {
      var tons = Math.round(state.guanoStockpile * 1000) / 1000;
      var companyRate = this.getCompanyRate(state);
      var payPerTon = this.getEffectivePayPerTon(state);
      var payout = Math.round(tons * payPerTon * 100) / 100;

      state.guanoStockpile = 0;
      state.guanoShipped = Math.round((state.guanoShipped + tons) * 1000) / 1000;
      state.companyGrossSales = Math.round(((state.companyGrossSales || 0) + (tons * companyRate)) * 100) / 100;
      state.totalRevenue = Math.round(((state.totalRevenue || 0) + payout) * 100) / 100;
      state.cash = Math.round((state.cash + payout) * 100) / 100;

      summary.autoSoldTons = tons;
      summary.autoSoldPay = payout;
      summary.addedCash += payout;
    }

    if (state.pendingPayments && state.pendingPayments.length) {
      for (var i = 0; i < state.pendingPayments.length; i++) {
        summary.pendingReleased += state.pendingPayments[i].amount || 0;
      }
      summary.pendingReleased = Math.round(summary.pendingReleased * 100) / 100;
      state.cash = Math.round((state.cash + summary.pendingReleased) * 100) / 100;
      state.totalRevenue = Math.round(((state.totalRevenue || 0) + summary.pendingReleased) * 100) / 100;
      state.pendingPayments = [];
      summary.addedCash = Math.round((summary.addedCash + summary.pendingReleased) * 100) / 100;
    }

    state.finalSettlement = summary;
    return summary;
  },

  getNetWorth: function(state) {
    var pendingTotal = 0;
    for (var i = 0; i < state.pendingPayments.length; i++) {
      pendingTotal += state.pendingPayments[i].amount;
    }

    var inventoryValue = 0;
    inventoryValue += state.food * this.basePrices.food;
    inventoryValue += state.lanternOil * this.basePrices.lanternOil;
    inventoryValue += state.rope * this.basePrices.rope;
    inventoryValue += state.guanoStockpile * this.getPayPerTon(state);

    return {
      cash: state.cash,
      pendingPayments: pendingTotal,
      inventoryValue: Math.round(inventoryValue * 100) / 100,
      totalRevenue: state.totalRevenue,
      totalExpenses: state.totalExpenses,
      netProfit: state.totalRevenue - state.totalExpenses
    };
  }
};
