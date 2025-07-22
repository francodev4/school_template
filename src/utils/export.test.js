import { exportToCSV } from "./export.js";

describe("exportToCSV", () => {
  it("exporte correctement un tableau d'étudiants en CSV", () => {
    const data = [
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
      {
        name: "Lucas Bernard",
        class: "4ème B",
        status: "Présent",
        grade: "16/20",
      },
    ];
    const columns = ["name", "class", "status", "grade"];
    const expected =
      "name,class,status,grade\n" +
      "Jean Dupont,3ème A,Présent,15.5/20\n" +
      "Marie Martin,3ème A,Absent,14/20\n" +
      "Lucas Bernard,4ème B,Présent,16/20";
    expect(exportToCSV(data, columns)).toBe(expected);
  });

  it("gère les champs vides et les caractères spéciaux", () => {
    const data = [
      { name: "Alice", class: "", status: "Présent", grade: "18/20" },
      {
        name: 'Bob, "le fort"',
        class: "4ème B",
        status: "Absent",
        grade: "12/20",
      },
    ];
    const columns = ["name", "class", "status", "grade"];
    const expected =
      "name,class,status,grade\n" +
      "Alice,,Présent,18/20\n" +
      '"Bob, ""le fort""",4ème B,Absent,12/20';
    expect(exportToCSV(data, columns)).toBe(expected);
  });

  //   it("test des colonnes depassant", () => {
  //     const data = [
  //       { name: "Alice", class: "", status: "Présent", grade: "18/20" },
  //       {
  //         name: 'Bob, "le fort"',
  //         class: "4ème B",
  //         status: "Absent",
  //         grade: "12/20",
  //       },
  //     ];
  //     const columns = ["name", "class", "status", "grade", "max"];
  //     const expected =
  //       "name,class,status,grade\n" +
  //       "Alice,,Présent,18/20\n" +
  //       '"Bob, ""le fort""",4ème B,Absent,12/20';
  //     expect(exportToCSV(data, columns)).toBe(expected);
  //   });

  //   it("échoue si le résultat attendu est faux", () => {
  //     const data = [
  //       { name: "Alice", class: "3ème A", status: "Présent", grade: "18/20" },
  //     ];
  //     const columns = ["name", "class", "status", "grade"];
  //     // On met exprès un résultat attendu incorrect
  //     const expected = "name,class,status,grade\nAlice,3ème A,Absent,18/20";
  //     expect(exportToCSV(data, columns)).toBe(expected);
  //   });

  //   it("plante si on passe un mauvais type", () => {
  //     expect(() => exportToCSV(123, ["name"])).toThrow();
  //   });
});
