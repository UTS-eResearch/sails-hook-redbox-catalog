module.exports.routes = {
  'post /:branding/:portal/ws/catalog/rdmp': {
    controller: 'CatalogController',
    action: 'rdmpInfo',
    csrf: false
   },
   'post /:branding/:portal/ws/catalog/request': {
    controller: 'CatalogController',
    action: 'request',
    csrf: false
   },
   'get /:branding/:portal/ws/catalog/info': {
    controller: 'CatalogController',
    action: 'info',
    csrf: false
   } 
};