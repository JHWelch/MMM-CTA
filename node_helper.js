/* Magic Mirror
 * Node Helper: MMM-CTA
 *
 * By Jordan Welch
 * MIT Licensed.
 */

const Log = require('logger');
const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
  socketNotificationReceived (notification, payload) {
    if (notification !== 'MMM-CTA-FETCH') {
      return;
    }
    if (!this.validate(payload)) {
      return;
    }

    this.getData(payload);
  },

  async getData ({
    trainApiKey,
    busApiKey,
    maxResultsTrain,
    maxResultsBus,
    stops,
  }) {
    const responses = await Promise.all(stops.map(async (stop) => {
      if (stop.type === 'train') {
        return {
          ...stop,
          arrivals: await this.getTrainData(
            stop.id,
            maxResultsTrain,
            trainApiKey,
            stop.minimumArrivalTime ?? 0,
          ),
        };
      }

      return {
        ...stop,
        arrivals: await this.getBusData(
          stop.id,
          maxResultsBus,
          busApiKey,
          stop.minimumArrivalTime ?? 0,
        ),
      };
    }));

    this.sendSocketNotification('MMM-CTA-DATA', {
      stops: responses.flat(),
    });
  },

  async getBusData (id, maxResults, apiKey, minimumArrivalTime) {
    const response = await fetch(this.busUrl({
      id,
      apiKey,
      maxResults: minimumArrivalTime > 0 ? null : maxResults,
    }));
    const { 'bustime-response': data } = await response.json();
    const minimumArrivalTimeMinutes = minimumArrivalTime / 1000 / 60;

    if (!data?.prd) {
      return [];
    }

    return data.prd.filter((bus) => {
      return bus.prdctdn >= minimumArrivalTimeMinutes;
    }).map((bus) => ({
      route: bus.rt,
      direction: bus.rtdir,
      arrival: bus.prdctdn,
    })).slice(0, maxResults);
  },

  async getTrainData (id, maxResults, apiKey, minimumArrivalTime) {
    const response = await fetch(this.trainUrl({
      id,
      apiKey,
      maxResults: minimumArrivalTime > 0 ? null : maxResults,
    }));
    const { ctatt: data } = await response.json();

    if (!data?.eta) {
      return [];
    }

    return data.eta.filter((train) => {
      const arrivalTime = new Date(train.arrT);

      return arrivalTime - Date.now() > minimumArrivalTime;
    }).map((train) => ({
      direction: train.destNm,
      routeColor: this.routeToColor(train.rt),
      time: new Date(train.arrT),
    })).slice(0, maxResults);
  },

  validate (payload) {
    const required = [/** TODO: Add Required */];

    return this.validateRequired(payload, required);
  },

  validateRequired (payload, required) {
    let valid = true;
    required.forEach((req) => {
      if (!payload[req]) {
        Log.error(`MMM-CTA: Missing ${req} in config`);
        valid = false;
      }
    });

    return valid;
  },

  busUrl ({id, apiKey, maxResults = null}) {
    const params = new URLSearchParams({
      key: apiKey,
      stpid: id,
      format: 'json',
      ...(maxResults && { top: maxResults }),
    });

    return `http://www.ctabustracker.com/bustime/api/v2/getpredictions?${params.toString()}`;
  },

  trainUrl ({id, apiKey, maxResults = null}) {
    const params = new URLSearchParams({
      key: apiKey,
      mapid: id,
      outputType: 'json',
      ...(maxResults && { max: maxResults }),
    });

    return `http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?${params.toString()}`;
  },

  routeToColor (route) {
    return {
      Red: 'red',
      Blue: 'blue',
      Brn: 'brown',
      G: 'green',
      Org: 'orange',
      P: 'purple',
      Pink: 'pink',
      Y: 'yellow',
    }[route] || 'gray';
  },
});
