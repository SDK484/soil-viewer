import * as L from "leaflet";

const styleProperties = [
  "stroke",
  "color",
  "weight",
  "opacity",
  "fill",
  "fillColor",
  "fillOpacity"
];

/*
 * @class Polygon.MultiStyle
 * @aka L.Polygon.MultiStyle
 * @inherits L.Polygon
 */
L.Canvas.WithExtraStyles = L.Canvas.extend({
  _updatePoly: function(layer, closed) {
    const centerCoord = layer.getCenter();
    const center = this._map.latLngToLayerPoint(centerCoord);
    const originalParts = layer._parts.slice();

    // Draw extra styles
    if (Array.isArray(layer.options.extraStyles)) {
      const originalStyleProperties = styleProperties.reduce(
        (acc, cur) => ({ ...acc, [cur]: layer.options[cur] }),
        {}
      );
      const cx = center.x;
      const cy = center.y;

      for (let eS of layer.options.extraStyles) {
        const i = eS.inset || 1;
        const applyInset = p => ({
          x: (p.x - cx) * i + cx,
          y: (p.y - cy) * i + cy
        });

        layer._parts = layer._parts.map(partsArray =>
          partsArray.map(applyInset)
        );

        Object.keys(eS).map(k => (layer.options[k] = eS[k]));
        L.Canvas.prototype._updatePoly.call(this, layer, closed);
      }

      // Resetting original conf
      layer._parts = originalParts;
      Object.assign(layer.options, originalStyleProperties);
    }

    L.Canvas.prototype._updatePoly.call(this, layer, closed);
  }
});

L.Canvas.withExtraStyles = function(options) {
  return new L.Canvas.WithExtraStyles(options);
};
