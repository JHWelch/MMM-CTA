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

  it('will not show name section if not included', () => {
    data.stops[0].name = null;
    template = nunjucks.render('MMM-CTA.njk', data);

    expect(template).not.toContain('Train Stop');
    expect(template).not.toContain('class="bright align-middle"');
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

  describe('showRoute turned on', () => {
    beforeEach(() => {
      data.stops[0].showRoute = true;
      data.stops[0].arrivals[0].route = 'Red'; // Adding route info for testing
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('should show route', () => {
      expect(template).toContain('Red');
    });
  });

  describe('showRoute turned off', () => {
    beforeEach(() => {
      data.stops[0].showRoute = false;
      data.stops[0].arrivals[0].route = 'Red'; // Adding route info for testing
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('should not show route', () => {
      expect(template).not.toContain('Red');
    });
  });

  describe('showHeaders turned on', () => {
    beforeEach(() => {
      data.stops = [{
        type: 'bus',
        name: 'Bus Stop',
        showHeaders: true,
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
      expect(template).not.toContain('ROUTE');
    });
  });

  describe('showHeaders turned off', () => {
    beforeEach(() => {
      data.stops[0].showHeaders = false;
    });

    it('does not show headers', () => {
      template = nunjucks.render('MMM-CTA.njk', data);
      expect(template).not.toContain('DIRECTION');
      expect(template).not.toContain('ARRIVAL');
    });
  });

  describe('showHeaders and showRoute both on', () => {
    beforeEach(() => {
      data.stops[0].showHeaders = true;
      data.stops[0].showRoute = true;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('shows route header', () => {
      expect(template).toContain('ROUTE');
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
            route: '81',
            arrival: 5,
          },
          {
            direction: 'South',
            route: '81',
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
      expect(template).not.toContain('81');
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

  describe('showRoute turned on', () => {
    beforeEach(() => {
      data.stops[0].showRoute = true;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('should show route', () => {
      expect(template).toContain('81');
    });
  });

  describe('showRoute turned off', () => {
    beforeEach(() => {
      data.stops[0].showRoute = false;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('should not show route', () => {
      expect(template).not.toContain('81');
    });
  });

  describe('showHeaders turned on', () => {
    beforeEach(() => {
      data.stops = [{
        type: 'bus',
        name: 'Bus Stop',
        showHeaders: true,
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
      expect(template).not.toContain('ROUTE');
    });
  });

  describe('showHeaders turned off', () => {
    beforeEach(() => {
      data.stops[0].showHeaders = false;
    });

    it('does not show headers', () => {
      template = nunjucks.render('MMM-CTA.njk', data);
      expect(template).not.toContain('DIRECTION');
      expect(template).not.toContain('ARRIVAL');
    });
  });

  describe('showHeaders and showRoute both on', () => {
    beforeEach(() => {
      data.stops[0].showHeaders = true;
      data.stops[0].showRoute = true;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('shows route header', () => {
      expect(template).toContain('ROUTE');
    });
  });

  describe('routeIcons and showRoute both on', () => {
    beforeEach(() => {
      data.routeIcons = true;
      data.stops[0].showRoute = true;
      template = nunjucks.render('MMM-CTA.njk', data);
    });

    it('should show route and icons', () => {
      expect(template).toContain('fa-bus');
      expect(template).toContain('81');
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
