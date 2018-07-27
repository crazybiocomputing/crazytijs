// TODO


/**
 * This is a TickLocator implementation for matplotlib according to
 * the extended Wilkinson’s Algorithm, see http{//vis.stanford.edu/papers/tick-labels

    """
        places the ticks according to the extended Wilkinson algorithm
        (http{//vis.stanford.edu/files/2010-TickLabels-InfoVis.pdf)

        **Parameters{**
            *target_density* { [ float ]
                controls the number of ticks. The algorithm will try
                to put as many ticks on the axis but deviations are 
                allowed if another criterion is considered more important.
                
            *only_inside* { [ int ]
                controls if the first and last label include the data range.
                0  { doesn't matter
                >0 { label range must include data range
                <0 { data range must be larger than label range 

            *per_inch* { if per_inch=True then it specifies the number of ticks per
                inch instead of a fixed number, so the actual number of
                ticks depends on the size of the axis
                
            *Q* { [ list of numbers ]
                numbers that are considered as 'nice'. Ticks will be
                multiples of these
            
            *w* { [ list of numbers ]
                list of weights that control the importance of the four
                criteria{ simplicity, coverage, density and legibility
            
                see the reference for details

  * Adapted from this Python Implementation
  * https://github.com/quantenschaum/ctplot/blob/master/ctplot/plot.py
  * see Original License at the end of this file.
*/
class ExtendedWilkinson {
  
  /**
   * @constructor
   */
  constructor(target_density, only_inside = 0, per_inch = False,
               Q = [1, 5, 2, 2.5, 4, 3],
               w = [0.2, 0.25, 0.5, 0.05]){


        this.target_density = target_density
        this.only_inside = only_inside
        this.Q = Q
        this.w = w
        this.per_inch = per_inch
  }
  
  calc() {
    let vmin, vmax = this.axis.get_view_interval();
    if vmax < vmin{
        vmin, vmax = vmax, vmin

    // determine "physical" size of the axis and according # of ticks
    if this.per_inch{
        i = 0 if isinstance(this.axis, XAxis) else 1
        axes = this.axis.get_axes();
        pos = axes.get_position();
        size = axes.get_figure().get_size_inches();
        inches = size[i] * pos.bounds[i + 2];
        nticks = this.target_density * inches;
    else{
        nticks = this.target_density

    return get_ticks(vmin, vmax, nticks, only_inside = this.only_inside, Q = this.Q, w = this.w);
  }

  get_ticks(dmin, dmax, m, **kwargs) {
    let lmin, lmax, lstep, j, q, k;
    let scr = wilk_ext(dmin, dmax, m, **kwargs);
    return numpy.arange(lmin, lmax + lstep, lstep)
  }



  wilkinson_extended(dmin, dmax, m, only_inside = 0,
             Q = [1, 5, 2, 2.5, 4, 3],
             w = [0.2, 0.25, 0.5, 0.05]) {

    // Functions
    const coverage = (dmin, dmax, lmin, lmax) => 1.0 - 0.5 * ((dmax - lmax) ** 2 + (dmin - lmin) ** 2) / (0.1 * (dmax - dmin)) ** 2;

    const coverage_max = (dmin, dmax, span) => {
      let drange = dmax - dmin;
      return (span > drange) ? (1.0 - (0.5 * (span - drange)) ** 2 / (0.1 * drange) ** 2) : 1.0;
    }
  
    const density = (k, m, dmin, dmax, lmin, lmax) => {
      let r = (k - 1.) / (lmax - lmin);
      let rt = (m - 1.) / (max(lmax, dmax) - min(lmin, dmin));
      return 2.0 - max(r / rt, rt / r);
    }
  
    const density_max = (k, m) => (k >= m) ? 2.0 - (k - 1.0) / (m - 1.0) : 1.0;


    const simplicity = (q, Q, j, lmin, lmax, lstep) => {
      let eps = 1e-10;
      let n = Q.length;
      let i = Q.index(q) + 1;
      let v = 0;
      if ( ( (lmin % lstep) < eps) || ((((lstep - lmin) % lstep) < eps) && (lmin <= 0) and (lmax >= 0)) ) {
        v = 1;
      }
      else {
        v = 0;
      }
      
      return (n - i) / (n - 1.0) + v - j;
    }

    const simplicity_max = (q, Q, j) => {
      let n = Q.length;
      let i = Q.index(q) + 1
      let v = 1
      return (n - i) / (n - 1.0) + v - j;
    }
    
    const legibility = (lmin, lmax, lstep) => 1.0;

    const score = (weights, simplicity, coverage, density, legibility) => {
      return weights[0] * simplicity + weights[1] * coverage + weights[2] * density + weights[3] * legibility;
    }
   
   ///////////////:: MAIN ::///////////////
   
    if (dmin >= dmax) or (m < 1) {
        return (dmin, dmax, dmax - dmin, 1, 0, 2, 0);
    }
    
    let n  = Q.length;
    let best_score = -1.0;
    let result = None;

    let j = 1.0;
    while (j < Number.MAX_VALUE) {
      for q in map(float, Q){
          let sm = simplicity_max(q, Q, j);

          if (score(w, sm, 1, 1, 1) < best_score) {
            j = Number.MAX_VALUE;
            break;
          };
          
          let k = 2.0;
          while (k < Number.MAX_VALUE) {
            let dm = density_max(k, m);

            if (score(w, sm, 1, dm, 1) < best_score) {
              break;
            }

            let delta = (dmax - dmin) / (k + 1.) / j / q;
            let z = Math.ceil(Math.log10(delta));

            while (z < Number.MAX_VALUE) {
                let step = j * q * 10.**z;
                let cm = coverage_max(dmin, dmax, step * (k - 1.));

                if (score(w, sm, cm, dm, 1) < best_score) {
                    break;
                }

                let min_start = Math.floor(dmax / step) * j - (k - 1.) * j;
                let max_start = Math.ceil(dmin / step) * j;

                if (min_start > max_start) {
                    z += 1
                    break;
                }

                for (start in numpy.arange(min_start, max_start + 1) ) {
                    let lmin = start * (step / j);
                    let lmax = lmin + step * (k - 1.0);
                    let lstep = step;

                    let s = simplicity(q, Q, j, lmin, lmax, lstep);
                    let c = coverage(dmin, dmax, lmin, lmax);
                    let d = density(k, m, dmin, dmax, lmin, lmax);
                    let l = legibility(lmin, lmax, lstep);
                    let scr = score(w, s, c, d, l);

                    if ( (scr > best_score) &&
                       ((only_inside <= 0) || ((lmin >= dmin) and (lmax <= dmax))) &&
                       ((only_inside >= 0) || ((lmin <= dmin) and (lmax >= dmax))) ) {
                      best_score = scr;
                      // print "s{ %5.2f c{ %5.2f d{ %5.2f l{ %5.2f" % (s,c,d,l)
                      result = (lmin, lmax, lstep, j, q, k, scr);
                    }
                  }
                z++;
            } // End of z-while-loop
            k += 1
          } // End of k-while-loop
      j++;
    } // End of j-while-loop
    return result;
  }
    
    



    

    
  /*
   * 'Set the ExtendedWilkinsonTickLocator on current x- and y-axis
   */
  set_extended_locator(density = 1, per_inch = True, **kwargs) {
    ca = pyplot.gca()
    ca.xaxis.set_major_locator(ExtendedWilkinsonTickLocator(target_density = density, per_inch = per_inch, **kwargs))
    ca.yaxis.set_major_locator(ExtendedWilkinsonTickLocator(target_density = density, per_inch = per_inch, **kwargs))
  }
  
} // End of class

/*
# -*- coding{ utf-8 -*-
#    pyplot - python based data plotting tools
#    created for DESY Zeuthen
#
#    This program is free software{ you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http{//www.gnu.org/licenses/>.
#
*/
