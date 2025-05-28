async function saveToCsv() {
  const parser = new Json2csvParser({ flatten: true });
  const csv = parser.parse(data);
  const filePath = path.join(__dirname, "mcqs.csv");
  fs.writeFileSync(filePath, csv);
  return filePath;
}
async function saveToExcel(data){
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("MCQs");

  sheet.columns = [
    { header: "Question Number", key: "questionNumber" },
    { header: "Question", key: "question" },
    { header: "Option A", key: "a" },
    { header: "Option B", key: "b" },
    { header: "Option C", key: "c" },
    { header: "Option D", key: "d" },
  ];

  data.forEach((q) => {
    sheet.addRow({
      questionNumber: q.questionNumber,
      question: q.question,
      a: q.options?.a,
      b: q.options?.b,
      c: q.options?.c,
      d: q.options?.d,
    });
  });

  const filePath = path.join(__dirname, "mcqs.xlsx");
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}
