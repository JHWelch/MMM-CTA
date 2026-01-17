require('../__mocks__/Module');
require('../__mocks__/globalLogger');

const name = 'MMM-CTA';

let MMMCTA;

beforeEach(() => {
  jest.resetModules();
  require('../MMM-CTA');

  MMMCTA = global.Module.create(name);
  MMMCTA.setData({ name, identifier: `Module_1_${name}` });
});

it('has a default config', () => {
  expect(MMMCTA.defaults).toEqual({
    updateInterval: 60000,
    trainApiKey: null,
    busApiKey: null,
    maxResultsTrain: 5,
    maxResultsBus: 5,
    routeIcons: true,
    suffixStyle: 'long',
    showRoute: false,
    showHeaders: true,
    stops: [],
  });
});

it('requires expected version', () => {
  expect(MMMCTA.requiresVersion).toBe('2.28.0');
});

it('inits module in loading state', () => {
  expect(MMMCTA.loading).toBe(true);
});

describe('start', () => {
  const originalInterval = setInterval;
  const configObject = {
    trainApiKey: 'TRAIN_API_KEY',
    busApiKey: 'BUS_API_KEY',
    stops: [],
    maxResultsTrain: 5,
    maxResultsBus: 5,
  };

  beforeEach(() => {
    MMMCTA.setConfig(configObject);
    global.setInterval = jest.fn();
  });

  afterEach(() => {
    global.setInterval = originalInterval;
  });

  it('logs start of module', () => {
    MMMCTA.start();

    expect(global.Log.info).toHaveBeenCalledWith('Starting module: MMM-CTA');
  });

  it('requests data from node_helper with config variables', () => {
    MMMCTA.start();

    expect(MMMCTA.sendSocketNotification)
      .toHaveBeenCalledWith('MMM-CTA-FETCH', configObject);
  });

  test('interval requests data from node_helper', () => {
    MMMCTA.start();
    global.setInterval.mock.calls[0][0]();

    expect(MMMCTA.sendSocketNotification).toHaveBeenCalledTimes(2);
    expect(MMMCTA.sendSocketNotification)
      .toHaveBeenCalledWith('MMM-CTA-FETCH', configObject);
  });

  test('interval set starts with default value', () => {
    MMMCTA.setConfig({ updateInterval: 100000 });
    MMMCTA.start();

    expect(global.setInterval)
      .toHaveBeenCalledWith(expect.any(Function), 100000);
  });
});

describe('getTemplate', () => {
  it('returns template path', () => {
    expect(MMMCTA.getTemplate()).toBe('templates/MMM-CTA.njk');
  });
});

describe('getTemplateData', () => {
  let stops;

  describe('bus information', () => {
    beforeEach(() => {
      stops = [
        {
          type: 'bus',
          name: 'Mock Stop',
          arrivals: [
            {
              route: '152',
              direction: 'Westbound',
              arrival: 'DUE',
            },
            {
              route: '152',
              direction: 'Westbound',
              arrival: '1',
            },
            {
              route: '152',
              direction: 'Westbound',
              arrival: '27',
            },
          ],
        },
        {
          type: 'bus',
          name: 'Another Stop',
          arrivals: [],
        },
      ];

      MMMCTA.data.stops = stops;
    });

    it('returns information needed by template', () => {
      expect(MMMCTA.getTemplateData()).toEqual({
        loading: MMMCTA.loading,
        routeIcons: MMMCTA.config.routeIcons,
        stops: [
          {
            type: 'bus',
            name: 'Mock Stop',
            showHeaders: MMMCTA.config.showHeaders,
            showRoute: MMMCTA.config.showRoute,
            arrivals: [
              {
                direction: 'Westbound',
                arrival: 'DUE',
                routeColor: '',
                route: '152',
              },
              {
                direction: 'Westbound',
                arrival: '1 min',
                routeColor: '',
                route: '152',
              },
              {
                direction: 'Westbound',
                arrival: '27 mins',
                routeColor: '',
                route: '152',
              },
            ],
          },
          {
            type: 'bus',
            name: 'Another Stop',
            showHeaders: MMMCTA.config.showHeaders,
            showRoute: MMMCTA.config.showRoute,
            arrivals: [],
          },
        ],
      });
    });

    describe('routeIcons turned off', () => {
      beforeEach(() => {
        MMMCTA.setConfig({ routeIcons: false });
      });

      it('returns routeIcons false', () => {
        expect(MMMCTA.getTemplateData().routeIcons).toEqual(false);
      });
    });

    describe('showHeaders turned off', () => {
      beforeEach(() => {
        MMMCTA.setConfig({ showHeaders: false });
      });

      it('returns showHeaders false on each stop', () => {
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showHeaders).toEqual(false);
        expect(stop2.showHeaders).toEqual(false);
      });

      it('can be overridden to true', () => {
        MMMCTA.data.stops[0].showHeaders = true;
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showHeaders).toEqual(true);
        expect(stop2.showHeaders).toEqual(false);
      });
    });

    describe('showHeaders turned on', () => {
      beforeEach(() => {
        MMMCTA.setConfig({ showHeaders: true });
      });

      it('returns showHeaders false on each stop', () => {
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showHeaders).toEqual(true);
        expect(stop2.showHeaders).toEqual(true);
      });

      it('can be overridden to false', () => {
        MMMCTA.data.stops[0].showHeaders = false;
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showHeaders).toEqual(false);
        expect(stop2.showHeaders).toEqual(true);
      });
    });

    describe('showRoute turned off', () => {
      beforeEach(() => {
        MMMCTA.setConfig({ showRoute: false });
      });

      it('returns showRoute false on each stop', () => {
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showRoute).toEqual(false);
        expect(stop2.showRoute).toEqual(false);
      });

      it('can be overridden to true', () => {
        MMMCTA.data.stops[0].showRoute = true;
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showRoute).toEqual(true);
        expect(stop2.showRoute).toEqual(false);
      });
    });

    describe('showRoute turned on', () => {
      beforeEach(() => {
        MMMCTA.setConfig({ showHeaders: true });
      });

      it('returns showHeaders false on each stop', () => {
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showHeaders).toEqual(true);
        expect(stop2.showHeaders).toEqual(true);
      });

      it('can be overridden to false', () => {
        MMMCTA.data.stops[0].showHeaders = false;
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showHeaders).toEqual(false);
        expect(stop2.showHeaders).toEqual(true);
      });
    });
  });

  describe('train information', () => {
    beforeEach(() => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now); // Ensures time is consistent
      const threeMinutes = new Date();
      threeMinutes.setMinutes(threeMinutes.getMinutes() + 1);
      const twelveMinutes = new Date();
      twelveMinutes.setMinutes(twelveMinutes.getMinutes() + 12);

      stops = [
        {
          type: 'train',
          name: 'Mock Stop',
          arrivals: [
            {
              direction: '95th/Dan Ryan',
              time: now,
              routeColor: 'red',
            },
            {
              direction: '95th/Dan Ryan',
              time: threeMinutes,
              routeColor: 'red',
            },
            {
              direction: 'Howard',
              time: twelveMinutes,
              routeColor: 'green',
            },
          ],
        },
        {
          type: 'train',
          name: 'Another Stop',
          arrivals: [],
        },
      ];
      MMMCTA.data.stops = stops;
    });

    it('returns information needed by template', () => {
      expect(MMMCTA.getTemplateData()).toEqual({
        loading: MMMCTA.loading,
        routeIcons: MMMCTA.config.routeIcons,
        stops: [
          {
            type: 'train',
            name: 'Mock Stop',
            showHeaders: MMMCTA.config.showHeaders,
            showRoute: MMMCTA.config.showRoute,
            arrivals: [
              {
                direction: '95th/Dan Ryan',
                arrival: 'DUE',
                routeColor: 'cta-red',
              },
              {
                direction: '95th/Dan Ryan',
                arrival: '1 min',
                routeColor: 'cta-red',
              },
              {
                direction: 'Howard',
                arrival: '12 mins',
                routeColor: 'cta-green',
              },
            ],
          },
          {
            type: 'train',
            name: 'Another Stop',
            showHeaders: MMMCTA.config.showHeaders,
            showRoute: MMMCTA.config.showRoute,
            arrivals: [],
          },
        ],
      });
    });

    describe('showRoute turned off', () => {
      beforeEach(() => {
        MMMCTA.setConfig({ showRoute: false });
      });

      it('returns showRoute false on each stop', () => {
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showRoute).toEqual(false);
        expect(stop2.showRoute).toEqual(false);
      });

      it('can be overridden to true', () => {
        MMMCTA.data.stops[0].showRoute = true;
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showRoute).toEqual(true);
        expect(stop2.showRoute).toEqual(false);
      });
    });

    describe('showRoute turned on', () => {
      beforeEach(() => {
        MMMCTA.setConfig({ showRoute: true });
      });

      it('returns showRoute false on each stop', () => {
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showRoute).toEqual(false);
        expect(stop2.showRoute).toEqual(false);
      });

      it('can be overridden to false', () => {
        MMMCTA.data.stops[0].showRoute = false;
        const [stop1, stop2] = MMMCTA.getTemplateData().stops;

        expect(stop1.showRoute).toEqual(false);
        expect(stop2.showRoute).toEqual(false);
      });
    });
  });
});

describe('getStyles', () => {
  it('returns styles path', () => {
    expect(MMMCTA.getStyles()).toEqual([
      'font-awesome.css',
      'MMM-CTA.css',
    ]);
  });
});

describe('socketNotificationReceived', () => {
  const payload = {
    stops: [{
      type: 'bus',
      name: 'Mock Stop',
      arrivals: [
        {
          route: '152',
          direction: 'Westbound',
          arrival: '3',
        },
        {
          route: '152',
          direction: 'Westbound',
          arrival: '27',
        },
      ],
    }],
  };
  describe('notification is MMM-CTA-DATA', () => {
    it('sets stops', () => {
      MMMCTA.socketNotificationReceived('MMM-CTA-DATA', payload);

      expect(MMMCTA.data.stops).toBe(payload.stops);
    });

    it('sets loading to false', () => {
      MMMCTA.socketNotificationReceived('MMM-CTA-DATA', payload);

      expect(MMMCTA.loading).toBe(false);
    });

    it('updates dom', () => {
      MMMCTA.socketNotificationReceived('MMM-CTA-DATA', payload);

      expect(MMMCTA.updateDom).toHaveBeenCalled();
    });
  });

  describe('notification is not MMM-CTA-DATA', () => {
    it('does not set data', () => {
      MMMCTA.socketNotificationReceived('NOT-MMM-CTA-DATA', payload);

      expect(MMMCTA.data.stops).toEqual(undefined);
    });
  });
});

describe('minutesWithSuffix', () => {
  describe('suffix style is long', () => {
    beforeEach(() => {
      MMMCTA.setConfig({ suffixStyle: 'long' });
    });

    it('returns min for singular', () => {
      expect(MMMCTA.minutesWithSuffix(1)).toBe('1 min');
    });

    it('returns mins for plural', () => {
      expect(MMMCTA.minutesWithSuffix(2)).toBe('2 mins');
    });
  });

  describe('suffix style is short', () => {
    beforeEach(() => {
      MMMCTA.setConfig({ suffixStyle: 'short' });
    });

    it('returns m for singular', () => {
      expect(MMMCTA.minutesWithSuffix(1)).toBe('1m');
    });

    it('returns m for plural', () => {
      expect(MMMCTA.minutesWithSuffix(2)).toBe('2m');
    });
  });

  describe('suffix style is none', () => {
    beforeEach(() => {
      MMMCTA.setConfig({ suffixStyle: 'none' });
    });

    it('returns number', () => {
      expect(MMMCTA.minutesWithSuffix(1)).toBe('1');
    });
  });
});
