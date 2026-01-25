import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ----------------- Регистрируем шрифты -----------------
Font.register({
  family: "OpenSans",
  fonts: [
    { src: "/fonts/OpenSans-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/OpenSans-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/OpenSans-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/OpenSans-ExtraBold.ttf", fontWeight: 800 },
  ],
});

const ROWS_PER_PAGE = 21;

// ----------------- Стили -----------------
const styles = StyleSheet.create({
  page: {
    paddingTop: 28, // ~10 мм
    paddingBottom: 32, // ~11 мм (снизу запас)
    paddingLeft: 30, // ~10.5 мм (самое важное)
    paddingRight: 24, // ~8.5 мм
    fontSize: 9,
    fontFamily: "OpenSans",
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 13,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
  },
  titleRow: {
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 5,
    alignItems: "center",
  },
  titleText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCol: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
    textAlign: "center",
  },
  tableColLast: {
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 3,
    textAlign: "center",
  },
  numCol: { width: "4%" },
  nameCol: { width: "22%" },
  dateCol: { width: "3.5%" },
  totalCol: { width: "9%" },
  dateHeaderWrapper: {
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  verticalText: {
    transform: "rotate(-90deg)",
    width: 65,
    fontSize: 8,
    textAlign: "center",
  },
  signature: {
    marginTop: 70, // было 40 — опускаем ниже
  },
  signatureText: {
    fontSize: 11, // подпись читаемее
  },
  signatureLine: {
    marginTop: 20, // расстояние до линии
    width: 350, // длина линии под подпись
    borderBottomWidth: 1,
    borderColor: "#000",
  },
});

// ----------------- Типы -----------------
type ReportShiftDocumentProps = {
  rows: {
    employeeId: string;
    employeeName: string;
    hoursByDate: Record<string, number>;
    totalHours: number;
  }[];
  objectName: string;
};

// ----------------- Компонент -----------------
export const ReportShiftDocument: React.FC<ReportShiftDocumentProps> = ({
  rows,
  objectName,
}) => {
  const allDates = new Set<string>();
  rows.forEach((row) =>
    Object.keys(row.hoursByDate).forEach((d) => allDates.add(d)),
  );
  const sortedDates = Array.from(allDates).sort();

  const firstDate = sortedDates[0];
  let year = "";
  let monthName = "";
  if (firstDate) {
    const d = new Date(firstDate);
    year = String(d.getFullYear());
    const m = d.toLocaleString("ru-RU", { month: "long" });
    monthName = m[0].toUpperCase() + m.slice(1);
  }

  const getWeekdayShort = (dateStr: string) => {
    const d = new Date(dateStr);
    const w = d.toLocaleString("ru-RU", { weekday: "short" });
    return w[0].toUpperCase() + w.slice(1);
  };

  const totalByDate: Record<string, number> = {};
  sortedDates.forEach((d) => {
    totalByDate[d] = rows.reduce((sum, r) => sum + (r.hoursByDate[d] || 0), 0);
  });

  const grandTotal = rows.reduce((s, r) => s + r.totalHours, 0);

  const pages = Array.from(
    { length: Math.ceil(rows.length / ROWS_PER_PAGE) },
    (_, i) => rows.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE),
  );

  return (
    <Document>
      {pages.map((pageRows, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <Page
            key={pageIndex}
            size="A4"
            orientation="landscape"
            style={styles.page}
          >
            {/* Заголовок */}
            <View style={styles.header}>
              <Text style={styles.title}>{objectName}</Text>
            </View>

            <View style={styles.table}>
              {/* Название */}
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>
                  Табель учета рабочего времени за {monthName} {year}
                </Text>
              </View>

              {/* Шапка */}
              <View style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableColHeader, styles.numCol]}>№</Text>
                <Text style={[styles.tableColHeader, styles.nameCol]}>ФИО</Text>
                {sortedDates.map((date) => (
                  <View
                    key={date}
                    style={[
                      styles.tableColHeader,
                      styles.dateCol,
                      styles.dateHeaderWrapper,
                    ]}
                  >
                    <Text style={styles.verticalText}>
                      {new Date(date).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}{" "}
                      {getWeekdayShort(date)}
                    </Text>
                  </View>
                ))}
                <Text
                  style={[
                    styles.tableColHeader,
                    styles.tableColLast,
                    styles.totalCol,
                  ]}
                >
                  Часы
                </Text>
              </View>

              {/* Строки */}
              {pageRows.map((row, i) => (
                <View key={row.employeeId} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableCol, styles.numCol]}>
                    {pageIndex * ROWS_PER_PAGE + i + 1}
                  </Text>
                  <Text style={[styles.tableCol, styles.nameCol]}>
                    {row.employeeName}
                  </Text>
                  {sortedDates.map((d) => (
                    <Text key={d} style={[styles.tableCol, styles.dateCol]}>
                      {row.hoursByDate[d] || 0}
                    </Text>
                  ))}
                  <Text
                    style={[
                      styles.tableColLast,
                      styles.totalCol,
                      styles.tableColHeader,
                    ]}
                  >
                    {row.totalHours}
                  </Text>
                </View>
              ))}

              {/* Итоги — только на последней странице */}
              {isLastPage && (
                <View style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableColHeader, styles.numCol]} />
                  <Text style={[styles.tableColHeader, styles.nameCol]}>
                    Итого часов
                  </Text>
                  {sortedDates.map((d) => (
                    <Text
                      key={d}
                      style={[styles.tableColHeader, styles.dateCol]}
                    >
                      {totalByDate[d]}
                    </Text>
                  ))}
                  <Text
                    style={[
                      styles.tableColLast,
                      styles.totalCol,
                      styles.tableColHeader,
                    ]}
                  >
                    {grandTotal}
                  </Text>
                </View>
              )}
            </View>

            {isLastPage && (
              <View style={styles.signature}>
                <Text style={styles.signatureText}>Начальник участка:</Text>
                <View style={styles.signatureLine} />
              </View>
            )}
          </Page>
        );
      })}
    </Document>
  );
};
