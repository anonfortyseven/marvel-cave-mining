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

  // Map cave zones to image keys
  var ZONE_IMAGE_MAP = {
    'entrance': 'cave_entrance',
    'upper': 'cave_entrance',
    'mid': 'deep_cave',
    'lower': 'deep_cave',
    'deep': 'deep_cave',
    'abyss': 'deep_cave'
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

  // Get image for a cave chamber based on zone
  function getCaveImage(chamberId) {
    if (!window.CaveData) return '';
    var chamber = window.CaveData.getChamber(chamberId);
    if (!chamber) return '';

    var zone = chamber.zone || 'entrance';
    var imgKey = ZONE_IMAGE_MAP[zone] || 'cave_entrance';

    // Special chambers get mining image
    if (chamberId === 'guano_main' || chamberId === 'guano_deep') {
      imgKey = 'mining';
    }

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
