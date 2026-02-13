// economy.js - Economy system for The Marvel Cave Mining Company
// Handles guano sales, contracts, payments, inflation, and expenses

window.Economy = {
  // Constants
  GUANO_PRICE_PER_TON: 700,        // $700 per ton of guano
  SHIPPING_COST_PER_TON: 50,        // $50 shipping per ton
  PAYMENT_DELAY_DAYS: 5,            // 5-day payment delay
  BASE_INFLATION_RATE: 0.10,        // 10% per month
  WINTER_INFLATION_MULTIPLIER: 2,   // 2x inflation in winter

  // Store prices (base prices before inflation)
  basePrices: {
    food:       0.10,   // per lb
    lanternOil: 1.50,   // per gallon
    rope:       0.08,   // per foot
    timber:     0.50,   // per board
    dynamite:   2.00,   // per stick
    donkey:     40.00   // each
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
  updateInflation: function(state) {
    // 10% per month base, doubled in winter
    var dailyRate = this.BASE_INFLATION_RATE / 30; // approximate daily inflation
    if (state.season === 'winter') {
      dailyRate *= this.WINTER_INFLATION_MULTIPLIER;
    }
    state.inflationRate += dailyRate;
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
      case 'timber':     state.timber += quantity; break;
      case 'dynamite':   state.dynamite += quantity; break;
      case 'donkey':
        state.donkeys.count += quantity;
        break;
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

    var revenue = tons * this.GUANO_PRICE_PER_TON;
    var shippingCost = tons * this.SHIPPING_COST_PER_TON;
    var netRevenue = revenue - shippingCost;

    // Deduct from stockpile
    state.guanoStockpile -= tons;
    state.guanoShipped += tons;

    // Pay shipping cost immediately
    state.cash -= shippingCost;
    state.totalExpenses += shippingCost;

    // Create pending payment with 14-day delay
    var dueDate = new Date(state.date.getTime() + (this.PAYMENT_DELAY_DAYS * 86400000));
    state.pendingPayments.push({
      amount: revenue,
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
      message: 'Shipped ' + tons.toFixed(1) + ' tons. Payment of $' + revenue.toFixed(2) + ' due in ' + this.PAYMENT_DELAY_DAYS + ' days.'
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
  getFoodConsumption: function(state) {
    var partySize = window.GameState.getPartySize();
    var perPerson;

    switch (state.rationLevel) {
      case 'full':   perPerson = 2.4; break;  // ~12 lbs for 5
      case 'half':   perPerson = 1.2; break;  // ~6 lbs for 5
      case 'scraps': perPerson = 0.6; break;  // ~3 lbs for 5
      case 'none':   perPerson = 0;   break;
      default:       perPerson = 2.4; break;
    }

    // Donkeys eat too (about 1 lb each per day)
    var donkeyFood = state.donkeys.count * 1.0;

    return (perPerson * partySize) + donkeyFood;
  },

  // Calculate daily oil consumption
  getOilConsumption: function(state) {
    if (!state.isUnderground) return 0;
    return 0.5; // 0.5 gallons per day underground
  },

  // Consume daily resources, returns what was consumed and any shortages
  consumeDailyResources: function(state) {
    var result = { shortages: [] };

    // Food consumption
    var foodNeeded = this.getFoodConsumption(state);
    if (state.food >= foodNeeded) {
      state.food -= foodNeeded;
      result.foodConsumed = foodNeeded;
    } else {
      result.foodConsumed = state.food;
      result.shortages.push('food');
      state.food = 0;
      // Force ration level down
      if (state.rationLevel !== 'none') {
        if (state.food <= 0) state.rationLevel = 'none';
      }
    }

    // Oil consumption (only underground)
    if (state.isUnderground) {
      var oilNeeded = this.getOilConsumption(state);
      if (state.lanternOil >= oilNeeded) {
        state.lanternOil -= oilNeeded;
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
  getNetWorth: function(state) {
    var pendingTotal = 0;
    for (var i = 0; i < state.pendingPayments.length; i++) {
      pendingTotal += state.pendingPayments[i].amount;
    }

    var inventoryValue = 0;
    inventoryValue += state.food * this.basePrices.food;
    inventoryValue += state.lanternOil * this.basePrices.lanternOil;
    inventoryValue += state.rope * this.basePrices.rope;
    inventoryValue += state.timber * this.basePrices.timber;
    inventoryValue += state.dynamite * this.basePrices.dynamite;
    inventoryValue += state.donkeys.count * this.basePrices.donkey;
    inventoryValue += state.guanoStockpile * this.GUANO_PRICE_PER_TON;

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
