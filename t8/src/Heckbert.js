/**
 * Nice Numbers for Graph Labels.
 *
 *  Paul S. Heckbert, Nice Numbers for Graph Labels, From Graphics Gems 1 Edited by Andrew S. Glassner, pp 61-63.
 */
class Heckbert {
  /**
   * @constructor
   *
   */
  constructor( rangeMin, rangeMax, maxTicks = 10) {

    // Desired number of tick marks
    this.maxTicks = maxTicks;

    // Range min
    this.minPoint = rangeMin;
    
    // Range min
    this.maxPoint = rangeMax;
  }

  /**
   * Calculate and update values for tick spacing and nice
   * minimum and maximum data points on the axis.
   */
  calc() {
    let range = this.niceNum(maxPoint - minPoint, false);
    let tickSpacing = this.niceNum(range / (this.maxTicks - 1), true);
    let niceMin = Math.floor(this.minPoint / tickSpacing) * tickSpacing;
    let niceMax = Math.ceil(this.maxPoint / tickSpacing) * tickSpacing;
        
    return {
      tickSpacing: tickSpacing,
      niceMinimum: niceMin,
      niceMaximum: niceMax
    };
  }

  /**
   * Returns a "nice" number approximately equal to range Rounds
   * the number if round = true Takes the ceiling if round = false.
   *
   * @param {number} localRange - the data range
   * @param {boolean} round - If true round the data minimum down and the data maximum up. Loose labeling
   * @returns {number} A "nice" number to be used for the data range
   */
  niceNum(localRange, round) {

    // exponent of localRange 
    let exponent = Math.floor(Math.log10(localRange));
    // fractional part of localRange
    let fraction = localRange / Math.pow(10, exponent);
    // nice, rounded fraction
    let niceFraction; 
    
    if (round) {
      if (fraction < 1.5) {
        niceFraction = 1;
      }
      else if (fraction < 3) {
        niceFraction = 2;
      }
      else if (fraction < 7)
        niceFraction = 5;
      else
        niceFraction = 10;
    }
    else {
      if (fraction <= 1)
        niceFraction = 1;
      else if (fraction <= 2)
        niceFraction = 2;
      else if (fraction <= 5)
        niceFraction = 5;
      else
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
  }

  /**
   * Sets the range minimum and maximum data points for the axis.
   *
   * @param {number}  minPoint the minimum data point on the axis
   * @param {number}  maxPoint the maximum data point on the axis
   */
  setMinMaxRange( localMinPoint,  localMaxPoint) {
      this.minPoint = localMinPoint;
      this.maxPoint = localMaxoint;
      this.calc();
  }

  /**
   * Sets maximum number of tick marks we're comfortable with
   *
   * @param {number} localmaxTicks  - the maximum number of tick marks for the axis
   */
  setmaxTicks(localmaxTicks) {
      this.maxTicks = localmaxTicks;
      this.calc();
  }
} // End of class Heckbert
