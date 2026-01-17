/* global Module */

/* Magic Mirror
 * Module: MMM-CTA
 *
 * By Jordan Welch
 * MIT Licensed.
 */

Module.register('MMM-CTA', {
  defaults: {
    updateInterval: 60000,
    trainApiKey: null,
    busApiKey: null,
    maxResultsBus: 5,
    maxResultsTrain: 5,
    routeIcons: true,
    suffixStyle: 'long',
    showHeaders: true,
    showRoute: false,
    stops: [],
  },

  requiresVersion: '2.28.0',

  loading: true,

  start () {
    Log.info(`Starting module: ${this.name}`);
    const self = this;

    this.getData();

    setInterval(() => {
      self.getData();
    }, this.config.updateInterval);
  },

  getData () {
    this.sendSocketNotification('MMM-CTA-FETCH', {
      trainApiKey: this.config.trainApiKey,
      busApiKey: this.config.busApiKey,
      showRoute: this.config.showRoute,
      stops: this.config.stops,
      maxResultsTrain: this.config.maxResultsTrain,
      maxResultsBus: this.config.maxResultsBus,
    });
  },

  getTemplate () {
    return 'templates/MMM-CTA.njk';
  },

  getTemplateData () {
    return {
      loading: this.loading,
      routeIcons: this.config.routeIcons,
      showHeaders: this.config.showHeaders,
      stops: this.data.stops?.map((stop) => ({
        ...stop,
        arrivals: stop.arrivals?.map((arrival) => ({
          direction: arrival.direction,
          routeColor: arrival.routeColor ? `cta-${arrival.routeColor}` : '',
          route: arrival.route, //may need to check if this exists
          arrival: arrival.arrival
            ? this.formatMinutes(arrival.arrival)
            : this.getMinutesUntil(arrival.time),
        })),
      })),
    };
  },

  getScripts () {
    return [];
  },

  getStyles () {
    return [
      'font-awesome.css',
      'MMM-CTA.css',
    ];
  },

  getTranslations () {
    return {
      en: 'translations/en.json',
      es: 'translations/es.json',
    };
  },

  socketNotificationReceived (notification, payload) {
    if (notification !== 'MMM-CTA-DATA') {
      return;
    }

    this.data.stops = payload.stops;
    this.loading = false;
    this.updateDom(300);
  },

  getMinutesUntil (arrivalTime) {
    const now = new Date();
    const diffInMilliseconds = new Date(arrivalTime) - now;
    const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);

    return this.formatMinutes(diffInMinutes);
  },

  formatMinutes (minutes) {
    const minutesInt = parseInt(minutes, 10);

    if (Number.isNaN(minutesInt)) {
      return minutes;
    }
    if (minutesInt === 0) {
      return 'DUE';
    }

    return this.minutesWithSuffix(minutesInt);
  },

  minutesWithSuffix (minutes) {
    switch (this.config.suffixStyle) {
      case 'none':
        return minutes.toString();
      case 'short':
        return `${minutes.toString()}m`;
      case 'long':
      default:
        if (minutes === 1) {
          return `${minutes.toString()} min`;
        }

        return `${minutes.toString()} mins`;
    }
  },
});
