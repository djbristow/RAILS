import { useRSStore } from "@/stores/rs";
import {
  useConsistsStore,
  ADD_NEW_CONSIST,
  UPDATE_CONSIST,
} from "@/stores/consists";
import { isLocomotive } from "@/utils/consistRules";

const GAP_SECONDS = 25;
const IDLE_MS = 30000;
const CABOOSE_AAR_CODE = "NE";
const NAME_PREFIX = "RFID Train ";

const idOf = (car) => car.rollingStockId?._id ?? car.rollingStockId;

const sameCars = (a, b) =>
  a.length === b.length && a.every((c, i) => idOf(c) === idOf(b[i]));

// Treats a burst of rfid messages as one train. A train ends at a caboose (NE),
// at a gap of more than GAP_SECONDS between message `et` times, or after IDLE_MS
// of wall-clock silence.
// Tags are in arrival order: lead locomotive first, then the following cars.
export const createRfidConsistBuilder = () => {
  const rsStore = useRSStore();
  const consistsStore = useConsistsStore();
  let tags = [];
  let timer = null;
  let lastEt = 0;
  let queue = Promise.resolve();

  const reconcile = async (rsIds) => {
    const lead = rsStore.rs.find((rs) => rs._id === rsIds[0]);
    if (!isLocomotive(lead)) {
      console.log("RFID stream ignored: lead car is not a locomotive");
      return;
    }
    const existing = consistsStore.consists.find(
      (c) => c.cars?.length && idOf(c.cars[0]) === rsIds[0]
    );
    if (existing) {
      const facingById = new Map(existing.cars.map((c) => [idOf(c), c.facing]));
      const cars = rsIds.map((id) => ({
        rollingStockId: id,
        facing: facingById.get(id) ?? "A",
      }));
      if (sameCars(existing.cars, cars)) return;
      await consistsStore[UPDATE_CONSIST]({
        _id: existing._id,
        name: existing.name,
        trainNumber: existing.trainNumber,
        notes: existing.notes,
        cars,
      });
      return;
    }
    const next =
      consistsStore.consists.filter((c) => c.name?.startsWith(NAME_PREFIX))
        .length + 1;
    await consistsStore[ADD_NEW_CONSIST]({
      name: `${NAME_PREFIX}${next}`,
      trainNumber: String(next),
      notes: "Created from RFID stream",
      cars: rsIds.map((id) => ({ rollingStockId: id, facing: "A" })),
    });
  };

  const finish = () => {
    clearTimeout(timer);
    const ids = [];
    for (const tag of tags) {
      const rs = rsStore.rs.find((r) => r.rfid === tag);
      if (rs && !ids.includes(rs._id)) ids.push(rs._id);
    }
    tags = [];
    timer = null;
    if (!ids.length) return;
    queue = queue
      .then(() => reconcile(ids))
      .catch((e) => console.error("RFID consist update failed:", e));
  };

  return (rfid, et) => {
    const time = Number(et) || Date.now() / 1000;
    if (tags.length && time - lastEt > GAP_SECONDS) finish();
    lastEt = time;
    tags.push(rfid);
    clearTimeout(timer);
    const rs = rsStore.rs.find((r) => r.rfid === rfid);
    if (rs?.aarCode === CABOOSE_AAR_CODE) {
      finish();
    } else {
      // Fallback so the last train is saved when no further tag arrives
      timer = setTimeout(finish, IDLE_MS);
    }
  };
};
