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
    throw "Temperature is out of range -100 to 200 °C";
  }
}

// Function to find humidity ratio from the total pressure and the partial pressure of water vapor in the air mixture.
function hRFromPs(totalPressure, partialVaporPressure) {
  if (totalPressure > partialVaporPressure) {
    // Equation (22) from [ASHRAE]
    return (
      (0.62198 * partialVaporPressure) / (totalPressure - partialVaporPressure)
    );
  }
  // It is physically impossible for a partial pressure to be greater than a total pressure.
  else {
    throw "A partial pressure cannot be greater than total pressure";
  }
}

// Function that finds relative humidity from vapor pressure and saturated vapor pressure. Eqn (24) [ASHRAE]
function rHFromPs(vaporPressure, saturatedVaporPressure) {
  // Should be zero for dry air and unity for saturated air.
  if (vaporPressure < saturatedVaporPressure) {
    return vaporPressure / saturatedVaporPressure;
  }
  // vaporPressure cannot physically exeed the saturated vapor pressure.
  else {
    throw "Vapor pressure cannot physically exeed the saturated vapor pressure";
  }
}

// Function that finds relative humidity from degree of saturation, total pressure, and saturated vapor pressure. Eqn (25) [ASHRAE]
function rHFromPDOS(degreeofSaturation, totalPressure, saturatedVaporPressure) {
  // The degree of saturation must be between 0 and 1
  if (degreeofSaturation < 0.0) {
    throw "Degree of saturation cannot be less than 0";
  }
  // The degree of saturation must be between 0 and 1
  if (degreeofSaturation > 1.0) {
    throw "Degree of saturation cannot be greater than 1";
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

// Function to find humidity ratio from dry bulb, wet bulb, and saturated humidty ratio at wet bulb temperature.  Eqn (35) [ASHRAE]
function hRFromDBWBSatHR(dryBulbCelsius, wetBulbCelsius, satHumRatioWB) {
  return (
    ((2501 - 2.381 * wetBulbCelsius) * satHumRatioWB -
      1.006(dryBulbCelsius - wetBulbCelsius)) /
    (2501 + 1.805 * dryBulbCelsius - 4.186 * wetBulbCelsius)
  );
}

// Function to find the saturated vapor pressure at the dew point temperature from humidty ratio and total pressure.  Eqn (36) [ASHRAE]
function satVapPAtDPFromHRP(humidityRatio, totalPressure) {
  return (totalPressure * humidityRatio) / (0.62198 + humidityRatio);
}

// Function to find dew point temperature from vapor pressure equations (37) and (38) [ASHRAE]
function dPCelsiusFromVaporP(vaporPressure) {
  let alpha = MAth.log(vaporPressure);
  let dewPointCelsius = 0.0;

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
  dewPointCelsius =
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

class PsychroState {
  constructor(totalPressure, dryBulbCelsius) {
    // Construct at saturation line and dry bulb for given total pressure.
    this.totalPressure = totalPressure;
    this.dryBulbCelsius = dryBulbCelsius;
    this.wetBulbCelsius = dryBulbCelsius;
    this.dewPointCelsius = dryBulbCelsius;
    this.relativeHumidity = 100;
    this.satVaporPressure = satPFromDB(dryBulbCelsius);
    this.humidityRatio = hRFromPs(totalPressure, this.satVaporPressure);
  }
}
