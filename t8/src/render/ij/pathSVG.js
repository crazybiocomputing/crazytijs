
'use strict';

import {Matrix} from '../../Matrix';
  
  
// From https://stackoverflow.com/questions/14169234/the-relation-of-the-bezier-curve-and-ellipse
export const drawEllipse = (x, y, radiusX, radiusY, rotationAngle) => {

  let poly = {x:[], y:[]};
  
  let width_two_thirds = radiusX * 4 / 3;
  let rot = rotationAngle / 180.0 * Math.PI;
  
  let dx1 = Math.sin(rot) * radiusY;
  let dy1 = Math.cos(rot) * radiusY;
  let dx2 = Math.cos(rot) * width_two_thirds;
  let dy2 = Math.sin(rot) * width_two_thirds;

  let topCenterX = x - dx1;
  let topCenterY = y + dy1;
  let topRightX = topCenterX + dx2;
  let topRightY = topCenterY + dy2;
  let topLeftX = topCenterX - dx2;
  let topLeftY = topCenterY - dy2;

  let bottomCenterX = x + dx1;
  let bottomCenterY = y - dy1;
  let bottomRightX = bottomCenterX + dx2;
  let bottomRightY = bottomCenterY + dy2;
  let bottomLeftX = bottomCenterX - dx2;
  let bottomLeftY = bottomCenterY - dy2;

  // Computer perimeter approximation for nsteps
  let p = Math.PI * ( 3*(radiusX+radiusY) - Math.sqrt( (3*radiusX + radiusY)*(radiusX + 3*radiusY)));
  let nsteps = p / 5;
  poly = bezierCubic(poly,bottomCenterX, bottomCenterY,bottomRightX, bottomRightY, topRightX, topRightY, topCenterX, topCenterY,nsteps);
  poly = bezierCubic(poly,topCenterX, topCenterY,topLeftX, topLeftY, bottomLeftX, bottomLeftY, bottomCenterX, bottomCenterY,nsteps);

  return poly;
}
  
/////////////////////: MAIN :////////////////////

export const getPolygonFromPath = (path) => {

  let polygon = {x:[], y:[]};
  let x00, x01,x02,x03;
  let y00, y01,y02,y03;

  let matches = path.match(/([MVHLZCQAST][-+\d.,\s]*)/g);
  matches.forEach( command => {
    let type = command[0];
    let values = command.slice(1).trim().split(/[\s,]+/);
    console.log(command,type,values);
    switch (type) {
      // Lines
      case 'M': 
        polygon.x.push(parseFloat(values[0]));
        polygon.y.push(parseFloat(values[1]));
        break;
      case 'V': 
        polygon.x.push(polygon.x[polygon.x.length - 1]);
        polygon.y.push(parseFloat(values[0]));
        break;
      case 'H':
        polygon.x.push(parseFloat(values[0]));
        polygon.y.push(polygon.y[polygon.y.length - 1]);
        break;
      case 'L': 
        polygon.x.push(parseFloat(values[0]));
        polygon.y.push(parseFloat(values[1]));
        break;
      case 'Z': 
        polygon.x.push(polygon.x[0]);
        polygon.y.push(polygon.y[0]);
        break;
      // Curves 
      case 'C': 
        x00 = polygon.x[polygon.x.length - 1];
        y00 = polygon.y[polygon.y.length - 1];
        x01 = parseFloat(values[0]);
        y01 = parseFloat(values[1]);
        x02 = parseFloat(values[2]);
        y02 = parseFloat(values[3]);
        x03 = parseFloat(values[4]);
        y03 = parseFloat(values[5]);
        console.log(`[ [${x00},${y00}],[${x01},${y01}],[${x02},${y02}],[${x03},${y03}] ]`);

        polygon = bezierCubic(polygon,x00,y00,x01,y01,x02,y02,x03,y03);
        break;
      case 'S': 
        x00 = x03;
        y00 = y03;
        // Get Symmetrical of xy02 with respect to xy03
        x01 = 2 * x03 - x02;
        y01 = 2 * y03 - y02;
        x02 = parseFloat(values[0]);
        y02 = parseFloat(values[1]);
        x03 = parseFloat(values[2]);
        y03 = parseFloat(values[3]);

        polygon = bezierCubic(polygon,x00,y00,x01,y01,x02,y02,x03,y03);
        break;
      case 'Q': 
        x00 = polygon.x[polygon.x.length - 1];
        y00 = polygon.y[polygon.y.length - 1];
        x01 = parseFloat(values[0]);
        y01 = parseFloat(values[1]);
        x02 = parseFloat(values[2]);
        y02 = parseFloat(values[3]);

        polygon = bezierQuad(polygon,x00,y00,x01,y01,x02,y02);
        break;
      case 'T': 
        // Symmetrical
        x01 = 2 * x02 - x01;
        y01 = 2 * y02 - y01;
        x00 = x02;
        y00 = y02;
        x02 = parseFloat(values[0]);
        y02 = parseFloat(values[1]);

        polygon = bezierQuad(polygon,x00,y00,x01,y01,x02,y02);
        // Get Symmetrical ,[2 * x3 - x2, 2 * y3 - y2]
        break;
      case 'A': 
        // rx ry x-axis-rotation large-arc-flag sweep-flag x y
        let rx = parseFloat(values[0]);
        let ry = parseFloat(values[1]);
        let phi = parseFloat(values[2]);
        let fA = parseFloat(values[3]);
        let fS = parseFloat(values[4]);
        let x = parseFloat(values[5]);
        let y = parseFloat(values[6]);
        
        // start point
        x00 = polygon.x[polygon.x.length - 1];
        y00 = polygon.y[polygon.y.length - 1];
        // end point
        x01 = parseFloat(values[5]);
        y01 = parseFloat(values[6]);
        // Ellipse center
        let cx, cy;
        [cx,cy] = getEllipseCenter(x00,y00,rx,ry,phi,fA,fS,x01,y01);
        
        // Draw the ellipse
        let arc = getArc(drawEllipse(cx,cy,rx,ry,phi), x00,y00, fA,x01,y01 );
        
        // Cut the ellipse depending of flags and start + end points
        
        polygon.x = [...polygon.x,...arc.x];
        polygon.y = [...polygon.y,...arc.y];
        break;
    }
  });
  
  return polygon;
}
  
const bezierCubic = (poly,x0,y0,x1,y1,x2,y2,x3,y3,num=20) => {
  // https://javascript.info/bezier-curve
  // P = (1−t)^3.P1 + 3.(1−t)^2.t.P2 +3.(1−t)t^2.P3 + t^3.P4
  for (let t=0; t <= 1.0; t+=1/num) {
    let x = Math.pow((1 - t),3)*x0 + 3 * Math.pow((1-t),2)*t*x1 + 3*(1-t)*Math.pow(t,2)*x2 + Math.pow(t,3)*x3;
    let y = Math.pow((1 - t),3)*y0 + 3 * Math.pow((1-t),2)*t*y1 + 3*(1-t)*Math.pow(t,2)*y2 + Math.pow(t,3)*y3;
    poly.x.push(x);
    poly.y.push(y);
  }
  poly.x.push(x3);
  poly.y.push(y3);
  return poly;
}


const parsePath = (path) => {

  const bezierQuad = (poly,x0,y0,x1,y1,x2,y2,num=20) => {
    // https://javascript.info/bezier-curve
    // P = (1−t)^2.P1 + 2.(1−t).t.P2 + t^2.P3
    for (let t=0; t <= 1.0; t+=1/num) {
      let x = Math.pow((1 - t),2)*x0 + 2 * (1-t)*t*x1 + Math.pow(t,2)*x2;
      let y = Math.pow((1 - t),2)*y0 + 2 * (1-t)*t*y1 + Math.pow(t,2)*y2;
      poly.x.push(x);
      poly.y.push(y);
    }
    poly.x.push(x2);
    poly.y.push(y2);
    return poly;
  }
  
  const deCasteljau = (x0,y0,x1,y1,x2,y2,x3,y3) => (t) => {
    let a = [[x0,y0],[x1,y1],[x2,y2],[x3,y3]];

    // Symmetrical ,[2 * x3 - x2, 2 * y3 - y2]
    while (a.length > 1) {
//     for (a = pts; a.length > 1; a = b)  // do..while loop in disguise
      let b = [];
      for (let i = 0; i < a.length - 1; i++) { // cycle over control points
        b[i] = [];
        for (let j = 0; j < a[i].length; j++) { // cycle over dimensions
          b[i][j] = a[i][j] * (1 - t) + a[i+1][j] * t;  // interpolation
        }
      }
      a = b;
    }
    return a[0];
  }

  // Calculate the ellipse center
  // From https://stackoverflow.com/questions/197649/how-to-calculate-center-of-an-ellipse-by-two-points-and-radius-sizes
  // Based on http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
  const getEllipseCenter = (x1,y1,rx,ry,rot,fA,fS,x2,y2) => {
    
    // Step 1: Compute (x1′, y1′) by translating to midpoint for ease and rotating the axis
    let phi = rot/180.0 * Math.PI;
    let matrix = Matrix.fromSVG([Math.cos(phi), -Math.sin(phi), Math.sin(phi),Math.cos(phi),0.0,0.0] );
    
    let x1p,y1p,z1p;
    [x1p,y1p,z1p] = Matrix.transform([(x1-x2)/2, (y1-y2)/2,1.0],matrix);  // x1 prime and y1 prime
    console.log(x1 + ' ' + y1 + ' => ' + x1p + ' ' + y1p + ' ' + z1p);
    console.log('midpoint ' + (x1+x2)/2 + ' ; ' + (y1+y2)/2);
    
    // Ensure radii are large enough
    // Based on http://www.w3.org/TR/SVG/implnote.html#ArcOutOfRangeParameters
    // Step (a): Ensure radii are non-zero
    // Step (b): Ensure radii are positive
    let _rx = Math.abs(rx);
    let _ry = Math.abs(ry);
    // Step (c): Ensure radii are large enough
    let lambda = ( (x1p * x1p) / (_rx * _rx) ) + ( (y1p * y1p) / (_ry * _ry) );
    if (lambda > 1) {
      _rx = Math.sqrt(lambda) * _rx;
      _ry = Math.sqrt(lambda) * _ry;
    }
    console.log(lambda + ': ' + _rx + ' x ' + _ry);
    
    // Step 2: Compute (cx′, cy′)
    let sign = (fA === fS) ? -1 : 1;

    // Compute... formula (F.6.5.2)
    let result = Math.max(0.0, ( (_rx*_rx*_ry*_ry) - (_rx*_rx*y1p*y1p) - (_ry*_ry*x1p*x1p) ) / ( (_rx*_rx*y1p*y1p) + (_ry*_ry*x1p*x1p) ) );
    let co = sign * Math.sqrt(result);

    let Cp = [_rx*y1p/_ry * co, -_ry*x1p/_rx * co, 1.0];
    console.log('Cp ' + Cp);
    // Step 3: Compute (cx, cy) from (cx′, cy′)
    let invert = Matrix.fromSVG([Math.cos(phi), Math.sin(phi), -Math.sin(phi),  Math.cos(phi), (x1+x2)/2, (y1+y2)/2] );
        console.log(Matrix.transform(Cp,invert));
    return Matrix.transform(Cp,invert);
  }

  const getArc = (ellipse, x1,y1,fA,x2,y2) => {
  
    // Dot product
    const dot = (v1, v2) => {
      let norm1 = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
      let norm2 = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1]);
      
      return (v1[0]*v2[0] + v1[1]*v2[1])/norm1/norm2;
    }
    
    let poly = {x:[x1],y:[y1]};
    
    // Get intersecting line parameters
    let a = (y1 - y2);
    let b = (x2 - x1);
    let c = x1 * y2 - x2 * y1;

    // Clean...
    let points = ellipse.x.reduce( (accu,x,index) => {
      let y = ellipse.y[index];
      if ( Math.abs(x-x1) + Math.abs(y-y1) < 2.0) {
        return accu;
      }
      else if (a * x + b * y + c <= 0.0) {
        accu.push({x:x,y:y});
      }
      return accu;
    },[]);
    
    // Sort depending of cos(angle)
    let v = [(x2 - x1), (y2 - y1) ];
    
    let sorted = points.sort( (a,b) => {
      let va = [(a.x - x1), (a.y - y1)];
      let vb = [(b.x - x1), (b.y - y1)];
      return dot(va,v) > dot(vb,v);
    });
    
    sorted.forEach ( pt => {
      poly.x.push(pt.x);
      poly.y.push(pt.y);
    });

    // Add end point
    poly.x.push(x2);
    poly.y.push(y2);

    console.log(poly);
    return poly;
  }
  
} // End of parsePath
  

