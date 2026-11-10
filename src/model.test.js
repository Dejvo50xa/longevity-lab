import test from "node:test";
import assert from "node:assert/strict";
import { calcLifespan, sanitizeInputs, DEFAULT_INPUTS, BASE_LIFE, INPUT_RANGE } from "./model.js";

const withInput = (patch) => ({ ...DEFAULT_INPUTS, ...patch });
const total = (patch, bio) => calcLifespan(withInput(patch), bio).total;

test("an average person lands close to the population baseline", () => {
  const avg = { exerciseDays: 2, exerciseIntensity: 4, saunaSessions: 0, dietScore: 4.5, sleepScore: 5, socialScore: 5, coldExposure: 0, supplementScore: 2.5, smokingStatus: 0, alcoholScore: 2 };
  for (const sex of ["male", "female"]) {
    const r = calcLifespan(withInput({ ...avg, sex }));
    assert.ok(Math.abs(r.total - BASE_LIFE[sex]) < 0.5, `${sex}: ${r.total}`);
  }
});

test("better habits never lower the estimate", () => {
  for (const key of ["exerciseDays", "exerciseIntensity", "saunaSessions", "dietScore", "sleepScore", "socialScore", "coldExposure", "supplementScore"]) {
    const [lo, hi] = INPUT_RANGE[key];
    let prev = -Infinity;
    for (let v = lo; v <= hi; v++) {
      const t = total({ [key]: v });
      assert.ok(t >= prev - 0.05, `${key}=${v} lowered the estimate (${prev} -> ${t})`);
      prev = t;
    }
  }
});

test("more alcohol never raises the estimate, and smoking costs years", () => {
  let prev = Infinity;
  for (let v = 0; v <= 10; v++) { const t = total({ alcoholScore: v }); assert.ok(t <= prev + 0.05); prev = t; }
  assert.ok(total({ smokingStatus: 2 }) < total({ smokingStatus: 1, yearsQuit: 5 }));
  assert.ok(total({ smokingStatus: 1, yearsQuit: 5 }) < total({ smokingStatus: 1, yearsQuit: 25 }));
  assert.ok(total({ smokingStatus: 1, yearsQuit: 25 }) < total({ smokingStatus: 0 }));
});

test("the same habits add fewer years at 70 than at 25", () => {
  const best = { exerciseDays: 7, exerciseIntensity: 8, dietScore: 10, sleepScore: 10, socialScore: 10, saunaSessions: 5 };
  const gain = (age) => total({ ...best, age }) - BASE_LIFE.male;
  assert.ok(gain(70) < gain(25));
});

test("estimates stay in a believable range and come with an uncertainty band", () => {
  const extremes = [
    { exerciseDays: 7, exerciseIntensity: 10, saunaSessions: 7, dietScore: 10, sleepScore: 10, socialScore: 10, coldExposure: 10, supplementScore: 10, alcoholScore: 0, age: 18 },
    { exerciseDays: 0, exerciseIntensity: 1, saunaSessions: 0, dietScore: 0, sleepScore: 0, socialScore: 0, coldExposure: 0, supplementScore: 0, alcoholScore: 10, smokingStatus: 2, age: 90 },
  ];
  for (const sex of ["male", "female"]) for (const e of extremes) {
    const r = calcLifespan(withInput({ ...e, sex }), { apob: "60", hba1c: "5.0", crp: "0.3", bp: "110", vo2: "55" });
    assert.ok(r.total > 45 && r.total < 105, `total ${r.total}`);
    assert.ok(r.low < r.total && r.total < r.high);
  }
});

test("empty or non-numeric biomarkers are ignored", () => {
  const a = calcLifespan(DEFAULT_INPUTS, { apob: "", hba1c: "abc", crp: null, bp: undefined, vo2: "" });
  assert.equal(a.bioUsed, false);
  assert.equal(a.total, calcLifespan(DEFAULT_INPUTS).total);
});

test("saved answers are validated before use", () => {
  assert.deepEqual(sanitizeInputs(null), DEFAULT_INPUTS);
  assert.deepEqual(sanitizeInputs("nonsense"), DEFAULT_INPUTS);
  const s = sanitizeInputs({ age: 45, sex: "female", dietScore: 99, sleepScore: "8", hacked: true, exerciseDays: 6 });
  assert.equal(s.age, 45); assert.equal(s.sex, "female"); assert.equal(s.exerciseDays, 6);
  assert.equal(s.dietScore, DEFAULT_INPUTS.dietScore);   // out of range
  assert.equal(s.sleepScore, DEFAULT_INPUTS.sleepScore); // wrong type
  assert.equal("hacked" in s, false);
});
