// The Universal Gas Constant in SI units J/(kg mole·K)
const universalGasConstant = 8314.41;

// The difference between Celsius and Kelvin
const celsiusShift = 273.15;

// Function that converts temperature in Celsius to absolute temperature
function convertCelsiusToKelvin(tempInCelsius) {
  return tempInCelsius + celsiusShift;
}

// Function that converts absolute temperature to temperature in Celsius
function convertKelvinToCelsius(tempInKelvin) {
  return tempInKelvin - celsiusShift;
}

// Function to find the standard atmospheric pressure at a given altitude in meters.  Eqn (3) [ASHRAE]
function stdAtmPFromAltm(altitudeMeters) {
  if ((altitudeMeters >= 500) & (altitudeMeters <= 20000)) {
    const C0 = 0.0000225577;
    return 101.325 * Math.pow(1 - C0 * altitudeMeters, 5.2559);
  } else {
    throw new RangeError(
      `Altitudes of ${altitudeMeters} m is outside the valid range for the equation -500 to 20000 m`
    );
  }
}

// Function to find the standard atmospheric temperature at a given altitude in meters. Eqn (4) [ASHRAE]
function stdAtmTFromAltm() {
  if ((altitudeMeters >= 500) & (altitudeMeters <= 20000)) {
    const C0 = 0.0000225577;
    return 15 - 0.0065 * altitudeMeters;
  } else {
    throw new RangeError(
      `Altitudes of ${altitudeMeters} m is outside the valid range for the equation -500 to 20000 m`
    );
  }
}

// Function to find water vapor saturation pressure at an abosulte temperature over ice or liquid water.
// From [ASHRAE] equations (5) and (6).  These will produce slightly different results than extrapolating from tables (2) and (3)
function satPFromDB(tempInCelsius) {
  if (tempInCelsius >= -100.0 && tempInCelsius <= 200.0) {
    let lnVaporPressure = 0.0;
    let absTempInKelvin = convertCelsiusToKelvin(tempInCelsius);
    // Use equation (5)
    if (tempInCelsius < 0) {
      const C1 = -5674.5359;
      const C2 = 6.3925247;
      const C3 = -0.009677843;
      const C4 = 0.00000062215701;
      const C5 = 0.0000000020747825;
      const C6 = -0.0000000000009484024;
      const C7 = 4.1635019;

      lnVaporPressure =
        C1 / absTempInKelvin +
        C2 +
        C3 * absTempInKelvin +
        C4 * Math.pow(absTempInKelvin, 2) +
        C5 * Math.pow(absTempInKelvin, 3) +
        C6 * Math.pow(absTempInKelvin, 4) +
        C7 * Math.log(absTempInKelvin);
    }
    //Use equation (6)
    else {
      const C8 = -5800.2206;
      const C9 = 1.3914993;
      const C10 = -0.048640239;
      const C11 = 0.000041764768;
      const C12 = -0.000000014452093;
      const C13 = 6.5459673;

      lnVaporPressure =
        C8 / absTempInKelvin +
        C9 +
        C10 * absTempInKelvin +
        C11 * Math.pow(absTempInKelvin, 2) +
        C12 * Math.pow(absTempInKelvin, 3) +
        C13 * Math.log(absTempInKelvin);
    }
    return Math.pow(lnVaporPressure, Math.E);
  }
  // Equations (5) and (6) are valid for temperatures ranging from -100 to 200 C
  else {
    throw new RangeError(
      "Equation only valid for temperature range -100 to 200 °C"
    );
  }
}

//

// Function to find humidity ratio from the total pressure and the partial pressure of
// water vapor in the air mixture.
function hRFromPs(totalPressure, partialVaporPressure) {
  if (totalPressure > partialVaporPressure) {
    // Equation (22) from [ASHRAE]
    // Equation (23) from [ASHRAE] when the second parameter is the saturated
    // partial pressure at wetbulb temperature.
    return (
      (0.62198 * partialVaporPressure) / (totalPressure - partialVaporPressure)
    );
  }
  // It is physically impossible for a partial pressure to be greater than a total pressure.
  else {
    throw new RangeError(
      `Partial pressure ${partialVaporPressure} cannot be larger than total pressure ${totalPressure} kPa`
    );
  }
}

// Function to find humidity ratio from the total pressure and the partial pressure of water
// vapor in the air mixture.  Equation (22) solved for partial vapor pressure.
function partialVaporPFromHRP(totalPressure, humidityRatio) {
  return (totalPressure * humidityRatio) / (0.62198 + humidityRatio);
}

// Function to find humidity ratio from drybulb, wetbulb, and saturated humidity ratio at wetbulb
function hrFromHRDBWB(dryBulbCelsisus, wetBulbCelsius, saturatedHumRatioAtWB) {
  return (
    ((2501 - 2.381 * wetBulbCelsius) * saturatedHumRatioAtWB -
      1.006 * (dryBulbCelsisus - wetBulbCelsius)) /
    (2501 + 1.805 * dryBulbCelsisus - 4.186 * wetBulbCelsius)
  );
}

// Function that finds relative humidity from vapor pressure and
// saturated vapor pressure. Eqn (24) [ASHRAE]
function rHFromPs(vaporPressure, saturatedVaporPressure) {
  // Should be zero for dry air and unity for saturated air.
  if (vaporPressure < saturatedVaporPressure) {
    return vaporPressure / saturatedVaporPressure;
  }
  // vaporPressure cannot physically exeed the saturated vapor pressure.
  // This would be a point outside the saturation line.
  else {
    throw new RangeError(
      `Vapor pressure ${vaporPressure} cannot be larger than saturated vapor pressure ${saturatedVaporPressure} kPa`
    );
  }
}

// Function that finds relative humidity from degree of saturation, total pressure, and saturated vapor pressure. Eqn (25) [ASHRAE]
function rHFromPDOS(degreeofSaturation, totalPressure, saturatedVaporPressure) {
  // The degree of saturation must be between 0 and 1
  if (degreeofSaturation < 0.0) {
    throw new RangeError(
      `Degree of saturation ${degreeofSaturation} cannot be less than 0`
    );
  }
  // The degree of saturation must be between 0 and 1
  if (degreeofSaturation > 1.0) {
    throw new RangeError(
      `Degree of saturation ${degreeofSaturation} cannot be greater than 1`
    );
  }

  return (
    degreeofSaturation /
    (1.0 -
      (1.0 - degreeofSaturation) * (saturatedVaporPressure / totalPressure))
  );
}

// Function to find specific volume from drybulb temperature, humidity ratio, and the total pressure.
function specVFromDBHRP(dryBulbCelsius, humidityRatio, totalPressure) {
  const tempInKelvin = convertCelsiusToKelvin(dryBulbCelsius);
  // Eqn (28) [ASHRAE]
  return (
    (universalGasConstant * tempInKelvin * (1.0 + 1.6078 * humidityRatio)) /
    (28.964 * totalPressure)
  );
}

//Function to find specific enthalpy from dry bulb temperature and humidity ration.  Eqn (32) [ASHRAE]
function specEFromDBHR(dryBulbCelsius, humidityRatio) {
  return (
    1.006 * dryBulbCelsius + humidityRatio * (2501.0 + 1.805 * dryBulbCelsius)
  );
}

// Function to find humidity ratio from dry bulb, wet bulb, and saturated humidty ratio
// at wet bulb temperature.  Eqn (35) [ASHRAE]
function hRFromDBWBSatHR(dryBulbCelsius, wetBulbCelsius, satHumRatioWB) {
  return (
    ((2501 - 2.381 * wetBulbCelsius) * satHumRatioWB -
      1.006(dryBulbCelsius - wetBulbCelsius)) /
    (2501 + 1.805 * dryBulbCelsius - 4.186 * wetBulbCelsius)
  );
}

// Function to find the saturated vapor pressure at the dew point temperature
// from humidty ratio and total pressure.  Eqn (36) [ASHRAE]
function satVapPAtDPFromHRP(humidityRatio, totalPressure) {
  return (totalPressure * humidityRatio) / (0.62198 + humidityRatio);
}

// Function to find dew point temperature from vapor pressure equations (37) and (38) [ASHRAE]
function dPCelsiusFromVaporP(vaporPressure) {
  let alpha = MAth.log(vaporPressure);

  const C14 = 6.54;
  const C15 = 14.526;
  const C16 = 0.7389;
  const C17 = 0.09486;
  const C18 = 0.4569;

  const C19 = 6.09;
  const C20 = 12.608;
  const C21 = 0.4959;

  // For temperature 0 - 93 °C.
  // Start by assuming the dew point temperature is greater than 0 °C.
  let dewPointCelsius =
    C14 +
    C15 * alpha +
    C16 * Math.pow(alpha, 2) +
    C17 * Math.pow(alpha, 3) +
    C18 * Math.pow(vaporPressure, 0.1984);

  if (dewPointCelsius < 0.0) {
    // For temperature less than 0 °C.
    dewPointCelsius = C19 + C20 * alpha + C21 * Math.pow(alpha, 2);
  }

  return dewPointCelsius;
}

// Function to estimate the dewpoint temperature from dry bulb and wet bulb.
// Pretty good for temps between 30 and 60 degrees F
function estimateDPFromDBWB(dryBulb, wetBulb) {
  return dryBulb - (dryBulb - wetBulb) * 3;
}

//  Function to estimate the wetbulb temperature from dry bulb and dewpoint.
// Pretty good for temps between 30 and 60 degrees F
function estimateWBFromDBDP(dryBulb, dewPoint) {
  return dryBulb - (dryBulb - dewPoint) / 3;
}

class PsychroState {
  constructor(totalPressure, dryBulbCelsius) {
    // Construct at saturation line and dry bulb for given total pressure.
    this.totalPressure = totalPressure;
    this.dryBulbCelsius = dryBulbCelsius;
    this.wetBulbCelsius = dryBulbCelsius;
    this.dewPointCelsius = dryBulbCelsius;
    this.relativeHumidity = 100.0;
    this.satVaporPressure = satPFromDB(dryBulbCelsius);
    this.humidityRatio = hRFromPs(totalPressure, this.satVaporPressure);
    this.degreeofSaturation =
      this.humidityRatio / hRFromPs(totalPressure, this.satVaporPressure);
    this.vaporPressure = partialVaporPFromHRP(
      totalPressure,
      this.humidityRatio
    );
    this.specificVolume = specVFromDBHRP(
      dryBulbCelsius,
      this.humidityRatio,
      totalPressure
    );
    this.specificEnthalpy = specEFromDBHR(dryBulbCelsius, this.humidityRatio);
  }

  // Situation 1.  Outlined in [ASHRAE]
  set wetBulbCelsius(wetBulbCelsius) {
    if (wetBulbCelsius > this.dryBulbCelsius) {
      // This would be a situation where the state point is above the saturation line.
      // Therefore it is physically impossible for a wet bulb temperature to be higher
      // than dry bulb temperature.
      throw new RangeError(
        `Wet bulb ${wetBulbCelsius} > dry bulb ${this.dryBulbCelsius} °C`
      );
    }

    // Find saturation pressure at wetbulb temperature.
    // [ASHRAE] does not do a good job of explaining why this is appropriate.
    let satPressAtWB = satPFromDB(wetBulbCelsius);

    // Find saturated humidity ratio of moist air at thermodynamic wet-bulb temperature
    let satHRWB = hRFromPs(this.totalPressure, satPressAtWB);

    // Use equation (35) to find humidity ratio from saturated humidity ratio
    // at wetbulb, wetbulb, and drybulb.
    let hR = hrFromHRDBWB(this.dryBulbCelsius, wetBulbCelsius, satHRWB);

    // Find saturation pressure at dry bulb temperature.
    // let satPress = satPFromDB(this.dryBulbCelsius);

    // Find saturated humidty ratio using saturation pressure at dry bulb temperature.
    let satHR = hRFromPs(this.totalPressure, this.satVaporPressure);

    // Find degree of saturation from humidity ratio and saturated humidity ratio.
    let degOfSat = hR / satHR;

    // Find the relative humidity using the degree of saturation, the total pressure,
    // and the saturated vapor pressure at dry bulb temperature.
    let rH = rHFromPDOS(degOfSat, this.totalPressure, this.satVaporPressure);

    // find the specific volume from the dry bulb temperature, the humidity ratio,
    // and the total pressure.
    let specVol = specVFromDBHRP(this.dryBulbCelsius, hR, this.totalPressure);

    // Find the specific enthalpy using humidity ratio and dry bulb temperature
    let specEnth = specEFromDBHR(this.dryBulbCelsius, hR);

    // Find the vapor pressure at the dewpoint.
    let vaporPressAtDP = satVapPAtDPFromHRP(hR, this.totalPressure);

    // Find the dew point using the vapor pressure at the dew point
    let dewPointCelsius = dPCelsiusFromVaporP(vaporPressAtDP);

    // Set the attributes of the state point.
    // this.partialVaporPressure = ;
    this.wetBulbCelsius = wetBulbCelsius;
    this.dewPointCelsius = dewPointCelsius;
    this.relativeHumidity = rH;
    this.humidityRatio = hR;
    this.degreeofSaturation = degOfSat;
    this.specificVolume = specVol;
    this.specificEnthalpy = specEnth;
  }

  // Situation 2.  Outlined in [ASHRAE]
  set dewPointCelsius(dewPointCelsius) {
    let satPressAtDP = satPFromDB(dewPointCelsius);

    /*
      pw = pws(td) Table 3 or Equation (5) or (6) Sat. press. for temp. td
      W Equation (22)
      pws(t) Table 3 or Equation (5) or (6) Sat. press. for temp. td
      Ws Equation (23) Using pws(t)
      µ Equation (12) Using Ws
      φ Equation (25) Using pws(t)
      v Equation (28)
      h Equation (32)
      t* Equation (23) and (35) with Table 3 or with Equation (5) or (6) Requires trial-and-error or numerical solution method
    */
  }

  // Situation 3.  Outlined in [ASHRAE]
  set relativeHumidity(relativeHumidity) {
    /*
      pws(t) Table 3 or Equation (5) or (6) Sat. press. for temp. t
      pw Equation (24)
      W Equation (22)
      Ws Equation (23) Using pws(t)
      µ Equation (12) Using Ws
      v Equation (28)
      h Equation (32)
      td Table 3 with Equation (36), (37), or (38)
      t* Equation (23) and (35) with Table 3 or with Equation (5) or (6) Requires trial-and-error or numerical solution method
    */
  }
}
