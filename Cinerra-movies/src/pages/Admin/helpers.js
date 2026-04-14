export const uid = () => Date.now() + Math.floor(Math.random() * 99999);

export const emptyPerson   = () => ({ id: uid(), name: "", role: "", imageUrl: "" });
export const emptyTiming   = () => ({ id: uid(), time: "", audi: "" });
export const emptyPrice    = () => ({ id: uid(), name: "", price: "", rows: "" });
export const emptyTheater  = () => ({ id: uid(), theater: "", timings: [emptyTiming()], seatingPrices: [emptyPrice()] });
export const emptyShowDate = () => ({ id: uid(), date: "", theaters: [emptyTheater()] });