/*
 *  TIJS: Tools for ImageJ JavaScript
 *  Copyright (C) 2017-2019  Jean-Christophe Taveau.
 *
 *  This file is part of TIJS, module tml
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIJS.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */
 
'use strict';


// Class
export class GaussNaiveBayes {
  /**
   * @constructor
   */
  constructor () {
    this.sets = [];
    this._priors = [];
    this._classes = [];
  }
  
  classes() {
    return this._classes;
  }
  
  fit(trainingSet,trainingLabels,attributes) {
    // Create the _classes
    let labels = trainingLabels.filter( (value,index,self) => self.indexOf(value) === index);
    this._classes = Array.from( 
      {length:labels.length}, 
      (v,i) => ({
        label: labels[i],
        attributes: attributes.map( a => 
          ({
            type: a,
            mean:0.0,
            variance:0.0
          })
        )
      })
    );
    
    // Step #2 - Compute mean and variance for each attribute of each class
    this._classes.forEach( klass => {
      let filtered = trainingSet.filter( (d,index) => trainingLabels[index] === klass.label);
      let num = filtered.length;
      klass.attributes.forEach ( (attr) => {
        // From Wikipedia
        // https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
        attr.mean = filtered.reduce ( (_sum,v)=> _sum + v[attr.type],0.0) / num;
        attr.variance = filtered.reduce ( (_sum2,v)=> _sum2 + (v[attr.type] - attr.mean) * (v[attr.type] - attr.mean),0.0) / (num - 1);
      });
    });
    return this;
  }
  
  priors(priors_array) {
    this._priors = priors_array;
    return this;
  }
  
  predict(x) {
    let self = this;
    this.likelihoods = this._classes.map( (k) => k.attributes.reduce( (P,attr) => P * this._pdf(x[attr.type],attr.mean,attr.variance),1.0 ));
    // Not required because it is a constant. Just for normalization
    let evidence = likelihoods.reduce ( (sum,P,index) => sum + P * self._priors[index],0.0);
    let posteriors = this._classes.map ( (s,index) => 
      ({
        label:s.label,
        P:likelihoods[index] * self._priors[index] / evidence,
        numerator: likelihoods[index] * self._priors[index]
      })
    );
    let maxP = posteriors.reduce ( (max,p) => p.numerator > max.numerator ? p : max,{P:0.0,numerator:0.0});
    return maxP;
  }
  
  accuracy(dataset) {
  
  }
  
  // Gaussian Probability Density Function
  _pdf(x,mean,variance) {
    return Math.exp(-(x-mean)*(x-mean)/2.0/variance) / Math.sqrt(2.0*Math.PI*variance);
  }
} // End of class GaussNaiveBayes

