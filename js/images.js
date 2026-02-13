/* ============================================
   Images.js - Pixel Art Image Manager
   The Marvel Cave Mining Company
   ============================================ */

(function () {
  'use strict';

  // Image mappings - screen/location to image file
  var IMAGE_MAP = {
    // Screens
    title: 'images/title.png',
    town: 'images/town.png',
    death: 'images/death.png',
    victory: 'images/victory.png',
    scoring: 'images/victory.png',

    // Cave locations
    cave_entrance: 'images/cave_entrance.png',
    deep_cave: 'images/deep_cave.png',
    mining: 'images/mining.png',

    // Town shops
    general_store: 'images/general_store.png',
    blacksmith: 'images/blacksmith.png',
    tavern: 'images/tavern.png'
  };

  // Per-chamber images (chamber_id → image file)
  // Chambers without a specific image fall back to zone mapping
  var CHAMBER_IMAGE_MAP = {
    'marmaros':           'images/town.png',
    'cathedral_entrance': 'images/cathedral_entrance.png',
    'the_sentinel':       'images/the_sentinel.png',
    'cathedral_floor':    'images/cathedral_floor.png',
    'serpentine_passage': 'images/serpentine_passage.png',
    'egyptian_room':      'images/egyptian_room.png',
    'gulf_of_doom':       'images/gulf_of_doom.png',
    'fat_mans_misery':    'images/fat_mans_misery.png',
    'the_dungeon':        'images/the_dungeon.png',
    'spring_room':        'images/spring_room.png',
    'blondies_throne':    'images/blondies_throne.png',
    'cloud_room':         'images/cloud_room.png',
    'mammoth_room':       'images/mammoth_room.png',
    'lost_river':         'images/lost_river.png',
    'lake_genevieve':     'images/lake_genevieve.png',
    'lake_miriam':        'images/lake_miriam.png',
    'waterfall_room':     'images/waterfall_room.png'
  };

  // Map cave zones to fallback image keys
  var ZONE_IMAGE_MAP = {
    'surface': 'town',
    'zone1': 'cave_entrance',
    'zone2': 'cave_entrance',
    'zone3': 'deep_cave',
    'zone4': 'deep_cave',
    'zone5': 'deep_cave'
  };

  // Cache loaded images
  var imageCache = {};
  var preloaded = false;

  // Preload all images
  function preload() {
    if (preloaded) return;
    preloaded = true;

    var paths = {};
    for (var key in IMAGE_MAP) {
      paths[IMAGE_MAP[key]] = true;
    }
    for (var cid in CHAMBER_IMAGE_MAP) {
      paths[CHAMBER_IMAGE_MAP[cid]] = true;
    }

    for (var path in paths) {
      var img = new Image();
      img.src = path;
      imageCache[path] = img;
    }
  }

  // Get full-width 21:9 banner image HTML
  function getImageHtml(key) {
    var path = IMAGE_MAP[key];
    if (!path) return '';

    return '<div class="pixel-banner">' +
      '<img src="' + path + '" class="pixel-banner-img" alt="" loading="lazy">' +
      '</div>';
  }

  // Get image for a cave chamber — per-chamber image with zone fallback
  function getCaveImage(chamberId) {
    // Try per-chamber image first
    var chamberPath = CHAMBER_IMAGE_MAP[chamberId];
    if (chamberPath) {
      return '<div class="pixel-banner">' +
        '<img src="' + chamberPath + '" class="pixel-banner-img" alt="" loading="lazy"' +
        ' onerror="this.parentNode.style.display=\'none\'">' +
        '</div>';
    }

    // Fallback to zone-based mapping
    if (!window.CaveData) return '';
    var chamber = window.CaveData.getChamber(chamberId);
    if (!chamber) return '';

    var zone = chamber.zone || 'zone1';
    var imgKey = ZONE_IMAGE_MAP[zone] || 'cave_entrance';
    return getImageHtml(imgKey);
  }

  // Get shop image
  function getShopImage(shopId) {
    return getImageHtml(shopId);
  }

  // Start preloading when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preload);
  } else {
    preload();
  }

  window.Images = {
    getImageHtml: getImageHtml,
    getCaveImage: getCaveImage,
    getShopImage: getShopImage,
    preload: preload,
    IMAGE_MAP: IMAGE_MAP
  };

})();
