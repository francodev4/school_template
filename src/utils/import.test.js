import { parseCSV } from "./import.js";

describe("parseCSV", () => {
  it("parse un CSV simple", () => {
    const csv =
      "name,class,status,grade\nJean Dupont,3ème A,Présent,15.5/20\nMarie Martin,3ème A,Absent,14/20";
    const result = parseCSV(csv);
    expect(result).toEqual([
      {
        name: "Jean Dupont",
        class: "3ème A",
        status: "Présent",
        grade: "15.5/20",
      },
      {
        name: "Marie Martin",
        class: "3ème A",
        status: "Absent",
        grade: "14/20",
      },
    ]);
  });

  it("gère les champs vides", () => {
    const csv = "name,class,status,grade\nAlice,,Présent,18/20";
    const result = parseCSV(csv);
    expect(result).toEqual([
      { name: "Alice", class: "", status: "Présent", grade: "18/20" },
    ]);
  });

  it("retourne [] si le CSV est vide ou sans données", () => {
    expect(parseCSV("")).toEqual([]);
    expect(parseCSV("name,class")).toEqual([]);
  });

  it("gère les lignes incomplètes", () => {
    const csv = "name,class,status,grade\nBob,3ème B";
    const result = parseCSV(csv);
    expect(result).toEqual([{ name: "Bob", class: "3ème B" }]);
  });

  it("gère les caractères spéciaux", () => {
    const csv = 'name,class,status,grade\n"Bob, le fort",3ème B,Présent,12/20';
    const result = parseCSV(csv);
    expect(result).toEqual([
      {
        name: "Bob, le fort",
        class: "3ème B",
        status: "Présent",
        grade: "12/20",
      },
    ]);
  });
});
