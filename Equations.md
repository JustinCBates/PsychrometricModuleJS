dv = absolute humidity of moist air, mass of water per unit volume
of mixture
f = enhancement factor, used in Equations (23a) and (25a)
h = specific enthalpy of moist air
hs

- = specific enthalpy of saturated moist air at thermodynamic wetbulb temperature
  hw
- = specific enthalpy of condensed water (liquid or solid) at thermodynamic wet-bulb temperature and pressure of 101.325 kPa
  Hs = rate of sensible heat gain for space
  Ht = rate of total energy gain for space
  = mass flow of dry air, per unit time
  = mass flow of water (any phase), per unit time
  Mda = mass of dry air in moist air sample
  Mw = mass of water vapor in moist air sample
  n = nda + nw, total number of moles in moist air sample
  nda = moles of dry air
  nw = moles of water vapor
  p = total pressure of moist air
  pda = partial pressure of dry air
  ps = vapor pressure of water in moist air at saturation. Differs from
  saturation pressure of pure water because of presence of air.
  pw = partial pressure of water vapor in moist air
  pws = pressure of saturated pure water
  qs = rate of addition (or withdrawal) of sensible heat
  R = universal gas constant, 8314.41 J/(kg mole·K)
  Rda = gas constant for dry air
  Rw = gas constant for water vapor
  s = specific entropy
  t = dry-bulb temperature of moist air
  td = dew-point temperature of moist air
  t_st = thermodynamic wet-bulb temperature of moist air
  T = absolute temperature
  v = specific volume
  vT = total gas volume
  V = total volume of moist air sample
  W = humidity ratio of moist air, mass of water per unit mass of
  dry air
  Ws
- = humidity ratio of moist air at saturation at thermodynamic
  wet-bulb temperature
  xda = mole-fraction of dry air, moles of dry air per mole of mixture
  xw = mole-fraction of water, moles of water per mole of mixture
  xws = mole-fraction of water vapor under saturated conditions, moles
  of vapor per mole of saturated mixture
  Z = altitude
  α = ln(pw), parameter used in Equations (37) and (38)
  γ = specific humidity of moist air, mass of water per unit mass of
  mixture
  µ = degree of saturation W/Ws
  ρ = moist air density
  φ = relative humidity, dimensionless

Subscripts
as = difference between saturated moist air and dry air
da = dry air
f = saturated liquid water
fg = difference between saturated liquid water and saturated water
vapor
g = saturated water vapor
i = saturated ice
ig = difference between saturated ice and saturated water vapor
s = saturated moist air
t = total
w = water in any phase

//ASHRAE Equations
//Gas Constant for Dry Air
(1) Rda = 8314.41/28.9645 = 287.055 J/(kg·K)

//Gas Constant for Water Vapor
(2) Rw = 8314.41/18.01528 = 461.520 J/(kg·K)

(3) p = 101.325*(1-Z*2.25577 \*10^-5)^5.2559
5.2559

(4) t = 15 - 0.0065\*Z

where:
Z = altitude in meters
p = barometric pressure in kPa
t = temperature in °C

Equations (3) and (4) are accurate from −5000 m to 11 000 m. For
higher altitudes, comprehensive tables of barometric pressure and
other physical properties of the standard atmosphere can be found in
NASA (1976).

//Water vapor saturation pressure over ice for the temperature range of −100 to 0°C is
(5) ln(pWS) = C1*T^-1 + C2*T^0 + C3*T + C4*T^2 + C5*T^3 + C6*T^4 + C7\*ln(T)

//Saturation pressure over liquid water for the temperature range of 0 to 200°C
(6)
ln(pWS) = C8*T^-1 + C9*T^0 + C10*T^1 + C11*T^2 + C12*T^3 +C13*ln(T)

where:
C1 = −5.6745359 E+03
C2 = 6.3925247 E+00
C3 = −9.6778430 E-03
C4 = 6.2215701 E−07
C5 = 2.0747825 E−09
C6 = −9.4840240 E−13
C7 = 4.1635019 E+00
C8 = −5.8002206 E+03
C9 = 1.3914993 E+00
C10 = −4.8640239 E−02
C11 = 4.1764768 E−05
C12 = −1.4452093 E−08
C13 = 6.5459673 E+00

ln = natural logarithm
pws = saturation pressure, Pa
T = absolute temperature, K = °C + 273.15

// Humidity Ratio (alternatively, the moisture content or mixing
// ratio) W of a given moist air sample is defined as the ratio of the
// mass of water vapor to the mass of dry air contained in the sample
(7) W = Mw / Mda

(8) W = 0.62198\*xw / xda

// Specific Humidity γ is the ratio of the mass of water vapor to the total
// mass of the moist air sample
(9a) γ = Mw / (Mw + Mda)

(9b) γ = W ⁄ (1 + W)

// Absolute Humidity (alternatively, water vapor density) dv is the ratio of
// the mass of water vapor to the total volume of the sample
(10) dv = Mw ⁄ V

//Density of Moist Air is the ratio of the total mass to the total volume
(11) ρ = (Mda + Mw) ⁄ V = (1 ⁄ v)\*(1 + W)

// Degree of saturation µ is the ratio of the air humidity ratio W to the
//humidity ratio Ws of saturated moist air at the same temperature and pressure:
(12) µ = W / Ws(t,p)
where:
Ws(t,p) is the humidity ratio of
moist air saturated with respect to water (or ice) at the same temperature t and pressure p.

// Relative humidity φ is the ratio of the mole fraction of water vapor xw in
// a given moist air sample to the mole fraction xws in an air sample
// saturated at the same temperature and pressure
(13) φ = xw / xws(t,p)

// Equation 14 for calculating the Degree of Saturation
// is the result of combining Equations (8), (12), and (13)
(14) µ = φ / (1 + (1 - φ)\*Ws(t,p) ⁄ 0.62198)

// Dewpoint temperature td is the temperature of moist air saturated at the same pressure p,
// with the same humidity ratio W as that of the given sample of moist air. It is defined as
// the solution td(p, W) of the following equation
(15) Ws(p,td) = W

// Thermodynamic wet-bulb temperature t* is the temperature at which water (liquid or solid),
// by evaporating into moist air at a given dry-bulb temperature t and humidity ratio W, can bring air to
// saturation adiabatically at the same temperature t* while the total pressure p is maintained constant.
// This parameter is considered separately in the section on Thermodynamic Wet-Bulb Temperature
// and Dew-Point Temperature.

// PERFECT GAS RELATIONSHIPS FOR DRY AND MOIST AIR
// Dry Air
(16) pda*V = nda*R\*T

// Water Vapor
(17) pw*V = nw*R\*T

where:
pda = partial pressure of dry air
pw = partial pressure of water vapor
V = total mixture volume
nda = number of moles of dry air
nw = number of moles of water vapor
R = universal gas constant, 8314.41 J/(kg mol·K)
T = absolute temperature, K

(18) p*V =n*R*T
or
(19) (pda + pw)*V = (nda + nw)*R*T
where:
p = pda + pw is the total mixture pressure
n = nda + nw is the total number of moles in the mixture

// From eqns (16) through (19) the mole fractions of dry air
(20) xda = pda / (pda + pw) = pda ⁄ p

// and the mole fractions of water vapor
(21) xw = pw / (pda + pw) = pw ⁄ p

// Using eqns (8),(20), and (21) Humidity Ratio is then
(22) W = 0.62198 \* pw / (p - pw)

// Then using the definition from eqn (12)
(23) Ws = 0.62198 \* pws / (p-pws)

// Relative Humidity defined by eqn (13) and using substitution from (21) yeilds
(24) φ = pw / pws(t,p)

// Dropping into eqn (14) yeilds
(25) φ = µ / (1 - (1 - µ)\*(pws/p))

// Both φ and µ are zero for dry air and unity for saturated moist air.
// At intermediate states their values differ, substantially so at higher temperatures.

// The specific volume v of a moist air mixture is expressed in terms of a unit mass of dry air:
(26) v = V/Mda = V / (28.9645\*nda)
where:
V is the total volume of the mixture
Mda is the total mass of dry air
nda is the number of moles of dry air

// Thus with the relation p = pda + pw
(27) v = R*T / (28.9645 * (p - pw)) = Rda\*T/(p - pw)

// Then using eqn (22)
(28) v = R*T*(1 + 1.6078*W) / (28.964*p) = Rda*T*(1 + 1.6078\*W)/p

// In Equations (27) and (28), v is specific volume, T is absolute temperature,
// p is total pressure, pw is the partial pressure of water vapor, and W is
// the humidity ratio

// In specific units, Equation (28) may be expressed as

v = 0.2871 _ (t + 273.15)_(1 + 1.6078\*W) ⁄ p

where:
v = specific volume, m3/kg (dry air)
t = dry-bulb temperature, °C
W = humidity ratio, kg (water)/kg (dry air)
p = total pressure, kPa

//The enthalpy of a mixture of perfect gases equals the sum of the individual
// partial enthalpies of the components. Therefore, the specific enthalpy of
// moist air can be written as follows
(29) h = hda + W\*hg
where:
hda is the specific enthalpy for dry air in kJ/kg (dry air) at the temperature of the mixture
hg is the specific enthalpy for saturated water vapor in kJ/kg (water) at the temperature of the mixture

(30) hda ≈ 1.006*t
(31) hg ≈ 2501 + 1.805*t
where:
t is the dry-bulb temperature in °C.

(32) h = 1.006*t + W*(2501 + 1.805\*t)

(33) h + (Ws_st - W) \* hw_st = hs_st

(34) hw_st ≈ 4.186\*t_st

(35) W = ((2501 - 2.381 _ t_st)_ Ws_st - 1.006(t - t_st)) / ((2501 + 1.805*t) - 4.186*t_st)

(36) pws(td) = pw = p\*W ⁄ ( 0.62198 + W)

// For temperature 0 - 93 °C.
(37) td = C14*α^0 + C15*α^1 + C16*α^2 + C17*α^3 + C18\*pw^0.1984

// For temperature less than 0 °C.
(38) td = 6.09*α^0 + 12.608*α^1 + 0.4959\*α^2

where:
td = dew-point temperature, °C
α = ln(pw)
pw = water vapor partial pressure, kPa
C14 = 6.54
C15 = 14.526
C16 = 0.7389
C17 = 0.09486
C18 = 0.4569

(49)
