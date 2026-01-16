nunjucks = require('../../__mocks__/nunjucks');

translate = (str) => str;

let data;
let template;

describe('loading', () => {
  beforeEach(() => {
    data = { loading: true };
    template = nunjucks.render('MMM-CTA.njk', data);
  });

  it('shows loading', () => {
    expect(template).toContain('LOADING');
  });
});

describe('train stop', () => {
  beforeEach(() => {
    data = {
      stops: [{
        type: 'train',
        name: 'Train Stop',
        arrivals: [
          {
            direction: 'North',
            arrival: 5,
          },
          {
            direction: 'South',
            arrival: 10,
          },
        ],
      }],
    };
  });

  it('shows train stop name', () => {
    template = nunjucks.render('MMM-CTA.njk', data);

    expect(template).toContain('Train Stop');
  });

  it('shows train stop directions', () => {
    template = nunjucks.render('MMM-CTA.njk', data);

    expect(template).toContain('North');
    expect(template).toContain('South');
  });

  it('shows train stop arrivals', () => {
    template = nunjucks.render('MMM-CTA.njk', data);

    expect(template).toContain('5');
    expect(template).toContain('10');
  });

  describe('routeIcons turned on', () => {
    beforeEach(() => {
      data.routeIcons = true;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('shows train icon', () => {
      expect(template).toContain('fa-train');
    });
  });

  describe('routeIcons turned off', () => {
    beforeEach(() => {
      data.routeIcons = false;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('does not show train icon', () => {
      expect(template).not.toContain('fa-train');
    });
  });
});

describe('bus stop', () => {
  beforeEach(() => {
    data = {
      stops: [{
        type: 'bus',
        name: 'Bus Stop',
        arrivals: [
          {
            direction: 'North',
            arrival: 5,
          },
          {
            direction: 'South',
            arrival: 10,
          },
        ],
      }],
    };
    template = nunjucks.render('MMM-CTA.njk', data);
  });

  it('shows bus stop name', () => {
    expect(template).toContain('Bus Stop');
  });

  it('shows bus stop directions', () => {
    expect(template).toContain('North');
    expect(template).toContain('South');
  });

  it('shows bus stop arrivals', () => {
    expect(template).toContain('5');
    expect(template).toContain('10');
  });

  describe('routeIcons turned on', () => {
    beforeEach(() => {
      data.routeIcons = true;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('shows bus icon', () => {
      expect(template).toContain('fa-bus');
    });
  });

  describe('routeIcons turned off', () => {
    beforeEach(() => {
      data.routeIcons = false;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('does not show bus icon', () => {
      expect(template).not.toContain('fa-bus');
    });
  });

  describe('showHeaders turned on', () => {
    beforeEach(() => {
      data.showHeaders = true;
      data.stops = [{
        type: 'bus',
        name: 'Bus Stop',
        arrivals: [
          {
            direction: 'North',
            arrival: 5,
          },
        ],
      }];
    });

    it('shows headers', () => {
      template = nunjucks.render('MMM-CTA.njk', data);

      expect(template).toContain('DIRECTION');
      expect(template).toContain('ARRIVAL');
    });

    it('can be overridden per stop', () => {
      data.stops[0].showHeaders = false;
      template = nunjucks.render('MMM-CTA.njk', data);

      expect(template).not.toContain('DIRECTION');
      expect(template).not.toContain('ARRIVAL');
    });
  });

  describe('showHeaders turned off', () => {
    beforeEach(() => {
      data.showHeaders = false;
    });

    it('does not show headers', () => {
      template = nunjucks.render('MMM-CTA.njk', data);
      expect(template).not.toContain('DIRECTION');
      expect(template).not.toContain('ARRIVAL');
    });

    it('can be overridden per stop', () => {
      data.stops[0].showHeaders = true;
      template = nunjucks.render('MMM-CTA.njk', data);

      expect(template).toContain('DIRECTION');
      expect(template).toContain('ARRIVAL');
    });
  });
});

describe('multiple stops', () => {
  beforeEach(() => {
    data = {
      stops: [
        {
          type: 'bus',
          name: 'Bus Stop',
          arrivals: [],
        },
        {
          type: 'train',
          name: 'Train Stop',
          arrivals: [],
        },
      ],
    };
    template = nunjucks.render('MMM-CTA.njk', data);
  });

  it('shows all stop names', () => {
    expect(template).toContain('Bus Stop');
    expect(template).toContain('Train Stop');
  });
});

describe('no stops', () => {
  beforeEach(() => {
    data = {
      stops: [{
        type: 'bus',
        name: 'Bus Stop',
        arrivals: [],
      }],
    };
    template = nunjucks.render('MMM-CTA.njk', data);
  });

  it('shows no arrivals', () => {
    expect(template).toContain('No scheduled arrivals.');
  });
});
