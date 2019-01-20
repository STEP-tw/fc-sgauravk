const isMatching = (req, route) => {
  if (route.url == req.url && req.method == route.method) return true;
  if (route.handler && !(route.url || route.method)) return true;
  return false;
};

class App {
  constructor() {
    this.routes = [];
  }

  use(handler) {
    this.routes.push({ handler });
  }

  get(url, handler) {
    this.routes.push({ method: "GET", url, handler });
  }

  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }

  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(r => isMatching(req, r));
    
    let next = () => {
      let current = matchingRoutes[0];
      if (!current) return;
      matchingRoutes.shift();
      current.handler(req, res, next);
    };
    next();
  }
}
module.exports = App;
