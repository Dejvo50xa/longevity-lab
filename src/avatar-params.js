// How the calculator inputs translate into the avatar's look. Shared by the 2D (SVG) and 3D avatars.
var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };

export function targetParams(inputs, gained) {
  var ex = (inputs.exerciseDays * inputs.exerciseIntensity) / 10;
  var muscle = clamp(ex / 5, 0, 1);
  var fat = clamp(1.16 - (inputs.dietScore / 10) * 0.30, 0.82, 1.16);
  var health = (inputs.dietScore + inputs.sleepScore + inputs.socialScore + Math.min(inputs.exerciseDays, 5) * 2) / 40;

  var smoke = inputs.smokingStatus === 2 ? 1 : inputs.smokingStatus === 1 ? 0.5 : 0;
  var alcohol = clamp((inputs.alcoholScore - 5) / 5, 0, 1);
  var heavy = inputs.alcoholScore >= 8 ? 1 : 0;
  var supp = clamp(inputs.supplementScore / 10, 0, 1);
  var female = inputs.sex === "female" ? 1 : 0;

  var sleepy = clamp((5 - inputs.sleepScore) / 5, 0, 1);
  var sad = clamp((4 - inputs.socialScore) / 4, 0, 1);
  var happy = clamp((inputs.socialScore - 5) / 5, 0, 1) * clamp(health * 1.4, 0, 1);
  var cold = inputs.coldExposure / 10;
  var sauna = Math.min(inputs.saunaSessions / 5, 1);

  var r = 236 + health * 16, g = 196 + health * 30, b = 168 + health * 18;
  if (smoke > 0) { r *= (1 - 0.13 * smoke); g *= (1 - 0.21 * smoke); b *= (1 - 0.25 * smoke); }
  if (cold > 0.5) { r *= 0.95; g *= 0.97; b *= 1.05; }
  r += sauna * 10 + alcohol * 16; g -= alcohol * 6; b -= alcohol * 8;

  return {
    muscle: muscle, fat: fat, health: health, smoke: smoke, alcohol: alcohol, heavy: heavy,
    supp: supp, female: female, sleepy: sleepy, sad: sad, happy: happy,
    cold: cold, sauna: sauna,
    vit: clamp(0.5 + gained / 30, 0, 1),
    hairGray: clamp((inputs.age - 36) / 32, 0, 1),
    wrinkle: clamp((inputs.age - 42) / 46, 0, 1),
    recede: clamp((inputs.age - 48) / 40, 0, 1) * (1 - (inputs.sex === "female" ? 1 : 0)),
    slump: sleepy * 0.13 + sad * 0.12 + clamp((inputs.age - 55) / 45, 0, 1) * 0.13 - muscle * 0.07,
    bioAge: clamp(inputs.age - gained * 0.45, 18, 100),
    sr: r, sg: g, sb: b,
  };
}
