const fetchMock = require('@fetch-mock/jest').default;
const { manageFetchMockGlobally } = require('@fetch-mock/jest');

beforeAll(() => {
  require('../__mocks__/logger');
});

beforeEach(() => {
  manageFetchMockGlobally(jest);
});

afterEach(() => {
  fetchMock.mockReset();
});

const busData = {
  'bustime-response': {
    prd: [
      {
        tmstmp: '20240120 20:26',
        typ: 'A',
        stpnm: 'Addison & Lakewood',
        stpid: '12557',
        vid: '1637',
        dstp: 2042,
        rt: '152',
        rtdd: '152',
        rtdir: 'Westbound',
        des: 'Cumberland',
        prdtm: '20240120 20:29',
        tablockid: '152 -403',
        tatripid: '88355271',
        origtatripno: '251994266',
        dly: false,
        prdctdn: '3',
        zone: '',
      },
      {
        tmstmp: '20240120 20:26',
        typ: 'A',
        stpnm: 'Addison & Lakewood',
        stpid: '12557',
        vid: '1408',
        dstp: 10603,
        rt: '152',
        rtdd: '152',
        rtdir: 'Westbound',
        des: 'Cumberland',
        prdtm: '20240120 20:54',
        tablockid: '152 -406',
        tatripid: '88355270',
        origtatripno: '251994148',
        dly: false,
        prdctdn: '8',
        zone: '',
      },
      {
        tmstmp: '20240120 20:26',
        typ: 'A',
        stpnm: 'Addison & Lakewood',
        stpid: '12557',
        vid: '1637',
        dstp: 2042,
        rt: '152',
        rtdd: '152',
        rtdir: 'Westbound',
        des: 'Cumberland',
        prdtm: '20240120 20:29',
        tablockid: '152 -403',
        tatripid: '88355271',
        origtatripno: '251994266',
        dly: false,
        prdctdn: '15',
        zone: '',
      },
      {
        tmstmp: '20240120 20:26',
        typ: 'A',
        stpnm: 'Addison & Lakewood',
        stpid: '12557',
        vid: '1408',
        dstp: 10603,
        rt: '152',
        rtdd: '152',
        rtdir: 'Westbound',
        des: 'Cumberland',
        prdtm: '20240120 20:54',
        tablockid: '152 -406',
        tatripid: '88355270',
        origtatripno: '251994148',
        dly: false,
        prdctdn: '27',
        zone: '',
      },

    ],
  },
};

const mockBusFetch = () => fetchMock.mockGlobal().get(
  'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&format=json&top=5',
  busData,
);

const mockBusFetchNoTop = () => fetchMock.mockGlobal().get(
  'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&format=json',
  busData,
);

const mockBusFetchNoService = () => fetchMock.mockGlobal().get(
  'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&format=json&top=5',
  {
    'bustime-response': {
      error: [
        {
          stpid: '1234',
          msg: 'No service scheduled',
        },
      ],
    },
  },
);
const trainData = {
  ctatt: {
    tmst: '2024-01-20T21:23:30',
    errCd: '0',
    errNm: null,
    eta: [
      {
        staId: '41420',
        stpId: '30274',
        staNm: 'Addison',
        stpDe: 'Service toward 95th/Dan Ryan',
        rn: '826',
        rt: 'Red',
        destSt: '30089',
        destNm: '95th/Dan Ryan',
        trDr: '5',
        prdt: '2024-01-20T21:20:20',
        arrT: '2024-01-20T21:28:20',
        isApp: '0',
        isSch: '0',
        isDly: '0',
        isFlt: '0',
        flags: null,
        lat: '41.97345',
        lon: '-87.65853',
        heading: '178',
      },
      {
        staId: '41420',
        stpId: '30273',
        staNm: 'Addison',
        stpDe: 'Service toward Howard',
        rn: '922',
        rt: 'G',
        destSt: '30173',
        destNm: 'Howard',
        trDr: '1',
        prdt: '2024-01-20T21:20:03',
        arrT: '2024-01-20T21:32:03',
        isApp: '0',
        isSch: '0',
        isDly: '0',
        isFlt: '0',
        flags: null,
        lat: '41.90394',
        lon: '-87.62893',
        heading: '273',
      },
      {
        staId: '41420',
        stpId: '30273',
        staNm: 'Addison',
        stpDe: 'Service toward Howard',
        rn: '922',
        rt: 'G',
        destSt: '30173',
        destNm: 'Howard',
        trDr: '1',
        prdt: '2024-01-20T21:20:03',
        arrT: '2024-01-20T21:36:03',
        isApp: '0',
        isSch: '0',
        isDly: '0',
        isFlt: '0',
        flags: null,
        lat: '41.90394',
        lon: '-87.62893',
        heading: '273',
      },
      {
        staId: '41420',
        stpId: '30273',
        staNm: 'Addison',
        stpDe: 'Service toward 95th/Dan Ryan',
        rn: '922',
        rt: 'G',
        destSt: '30089',
        destNm: '95th/Dan Ryan',
        trDr: '1',
        prdt: '2024-01-20T21:20:03',
        arrT: '2024-01-20T21:40:03',
        isApp: '0',
        isSch: '0',
        isDly: '0',
        isFlt: '0',
        flags: null,
        lat: '41.90394',
        lon: '-87.62893',
        heading: '273',
      },
    ],
  },
};
const mockTrainFetch = () => fetchMock.mockGlobal().get(
  'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=TRAIN_API_KEY&mapid=1234&outputType=json&max=5',
  trainData,
);
const mockTrainFetchNoMax = () => fetchMock.mockGlobal().get(
  'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=TRAIN_API_KEY&mapid=1234&outputType=json',
  trainData,
);

let helper;
let fetch;

beforeEach(() => {
  helper = require('../node_helper');
  helper.setName('MMM-CTA');
  jest.useFakeTimers().setSystemTime(new Date('2024-01-20T21:27:00'));
});

describe('socketNotificationReceived', () => {
  describe('notification does not match MMM-CTA-FETCH', () => {
    it('does nothing', () => {
      helper.socketNotificationReceived('NOT-CTA-FETCH', {});

      expect(fetchMock.callHistory.callLogs).toHaveLength(0);
    });
  });

  describe('passed proper train config', () => {
    describe('minimumArrivalTime is not set', () => {
      beforeEach(() => {
        mockTrainFetch();

        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: 'TRAIN_API_KEY',
          busApiKey: null,
          maxResultsTrain: 5,
          maxResultsBus: 5,
          stops: [{
            type: 'train',
            id: '1234',
            name: 'Mock Stop',
          }],
        });
      });

      it('calls train API with passed arguments', () => {
        expect(fetchMock.callHistory.callLogs[0].args[0]).toBe(
          'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=TRAIN_API_KEY&mapid=1234&outputType=json&max=5',
        );
      });

      it('sends data to client', () => {
        expect(helper.sendSocketNotification).toHaveBeenCalledWith('MMM-CTA-DATA', {
          stops: [{
            id: '1234',
            type: 'train',
            name: 'Mock Stop',
            arrivals: [
              {
                direction: '95th/Dan Ryan',
                time: new Date('2024-01-20T21:28:20'),
                routeColor: 'red',
              },
              {
                direction: 'Howard',
                time: new Date('2024-01-20T21:32:03'),
                routeColor: 'green',
              },
              {
                direction: 'Howard',
                time: new Date('2024-01-20T21:36:03'),
                routeColor: 'green',
              },
              {
                direction: '95th/Dan Ryan',
                time: new Date('2024-01-20T21:40:03'),
                routeColor: 'green',
              },
            ],
          }],
        });
      });
    });

    describe('minimumArrivalTime is set', () => {
      beforeEach(() => {
        mockTrainFetchNoMax();

        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: 'TRAIN_API_KEY',
          busApiKey: null,
          maxResultsTrain: 2, // Not included in API, but still applied
          maxResultsBus: 5,
          stops: [{
            type: 'train',
            id: '1234',
            name: 'Mock Stop',
            minimumArrivalTime: 120000,
          }],
        });
      });

      it('does not include max parameter in api call', () => {
        expect(fetchMock.callHistory.callLogs[0].args[0]).toBe(
          'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=TRAIN_API_KEY&mapid=1234&outputType=json',
        );
      });

      it('sends data to client, filtered and still truncated', () => {
        expect(helper.sendSocketNotification).toHaveBeenCalledWith('MMM-CTA-DATA', {
          stops: [{
            id: '1234',
            type: 'train',
            name: 'Mock Stop',
            minimumArrivalTime: 120000,
            arrivals: [
              {
                direction: 'Howard',
                time: new Date('2024-01-20T21:32:03'),
                routeColor: 'green',
              },
              {
                direction: 'Howard',
                time: new Date('2024-01-20T21:36:03'),
                routeColor: 'green',
              },
            ],
          }],
        });
      });
    });
  });

  describe('passed proper bus config', () => {
    describe('minimumArrivalTime is not set', () => {
      beforeEach(() => {
        mockBusFetch();

        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: null,
          busApiKey: 'BUS_API_KEY',
          maxResultsTrain: 5,
          maxResultsBus: 5,
          stops: [{
            type: 'bus',
            id: '1234',
            name: 'Mock Stop',
          }],
        });
      });

      it('calls bus API with passed arguments', () => {
        expect(fetchMock.callHistory.callLogs[0].args[0]).toBe(
          'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&format=json&top=5',
        );
      });

      it('sends data to client', () => {
        expect(helper.sendSocketNotification).toHaveBeenCalledWith('MMM-CTA-DATA', {
          stops: [{
            id: '1234',
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
                arrival: '8',
              },
              {
                route: '152',
                direction: 'Westbound',
                arrival: '15',
              },
              {
                route: '152',
                direction: 'Westbound',
                arrival: '27',
              },
            ],
          }],
        });
      });
    });

    describe('minimumArrivalTime is set', () => {
      beforeEach(() => {
        mockBusFetchNoTop();

        helper.socketNotificationReceived('MMM-CTA-FETCH', {
          trainApiKey: null,
          busApiKey: 'BUS_API_KEY',
          maxResultsTrain: 5,
          maxResultsBus: 2, // Not included in API, but still applied
          stops: [{
            type: 'bus',
            id: '1234',
            name: 'Mock Stop',
            minimumArrivalTime: 240000,
          }],
        });
      });

      it('calls bus API without top parameter', () => {
        expect(fetchMock.callHistory.callLogs[0].args[0]).toBe(
          'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&format=json',
        );
      });

      it('sends data to client', () => {
        expect(helper.sendSocketNotification).toHaveBeenCalledWith('MMM-CTA-DATA', {
          stops: [{
            id: '1234',
            type: 'bus',
            name: 'Mock Stop',
            minimumArrivalTime: 240000,
            arrivals: [
              {
                route: '152',
                direction: 'Westbound',
                arrival: '8',
              },
              {
                route: '152',
                direction: 'Westbound',
                arrival: '15',
              },
            ],
          }],
        });
      });
    });
  });

  describe('passed both train and bus configs', () => {
    beforeEach(() => {
      mockTrainFetch(fetch);
      mockBusFetch(fetch);

      helper.socketNotificationReceived('MMM-CTA-FETCH', {
        trainApiKey: 'TRAIN_API_KEY',
        busApiKey: 'BUS_API_KEY',
        maxResultsTrain: 5,
        maxResultsBus: 5,
        stops: [
          {
            type: 'train',
            id: '1234',
            name: 'Mock Stop',
          },
          {
            type: 'bus',
            id: '1234',
            name: 'Mock Stop',
          },
        ],
      });
    });

    it('calls bus API with passed arguments', () => {
      expect(fetchMock.callHistory.callLogs[0].args[0]).toBe(
        'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=TRAIN_API_KEY&mapid=1234&outputType=json&max=5',
      );

      expect(fetchMock.callHistory.callLogs[1].args[0]).toBe(
        'http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=BUS_API_KEY&stpid=1234&format=json&top=5',
      );
    });

    it('sends data to client', () => {
      expect(helper.sendSocketNotification).toHaveBeenCalledWith('MMM-CTA-DATA', {
        stops: [
          {
            id: '1234',
            type: 'train',
            name: 'Mock Stop',
            arrivals: [
              {
                direction: '95th/Dan Ryan',
                time: new Date('2024-01-20T21:28:20'),
                routeColor: 'red',
              },
              {
                direction: 'Howard',
                time: new Date('2024-01-20T21:32:03'),
                routeColor: 'green',
              },
              {
                direction: 'Howard',
                time: new Date('2024-01-20T21:36:03'),
                routeColor: 'green',
              },
              {
                direction: '95th/Dan Ryan',
                time: new Date('2024-01-20T21:40:03'),
                routeColor: 'green',
              },
            ],
          },
          {
            id: '1234',
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
                arrival: '8',
              },
              {
                route: '152',
                direction: 'Westbound',
                arrival: '15',
              },
              {
                route: '152',
                direction: 'Westbound',
                arrival: '27',
              },
            ],
          },
        ],
      });
    });
  });

  describe('No bus service scheduled', () => {
    beforeEach(() => {
      mockBusFetchNoService(fetch);

      helper.socketNotificationReceived('MMM-CTA-FETCH', {
        trainApiKey: null,
        busApiKey: 'BUS_API_KEY',
        maxResultsTrain: 5,
        maxResultsBus: 5,
        stops: [{
          type: 'bus',
          id: '1234',
          name: 'Mock Stop',
        }],
      });
    });

    it('sends data to client', () => {
      expect(helper.sendSocketNotification).toHaveBeenCalledWith('MMM-CTA-DATA', {
        stops: [{
          id: '1234',
          type: 'bus',
          name: 'Mock Stop',
          arrivals: [],
        }],
      });
    });
  });
});
