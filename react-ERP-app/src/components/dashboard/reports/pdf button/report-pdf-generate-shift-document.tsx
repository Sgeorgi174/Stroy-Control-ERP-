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

// ----------------- Стили PDF -----------------
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9, // Уменьшен шрифт для компактности
    fontFamily: "OpenSans",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    marginLeft: 20,
    fontSize: 13, // Уменьшен шрифт заголовка
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3, // Уменьшен padding для компактности
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCol: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3, // Уменьшен padding
    textAlign: "center",
  },
  tableColLast: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 3,
    textAlign: "center",
  },
  numCol: { width: "4%" }, // Чуть уже
  nameCol: { width: "22%" }, // Чуть уже
  dateCol: { width: "3.5%" }, // Чуть шире
  totalCol: { width: "9%" }, // Чуть шире
  dateHeaderWrapper: {
    height: 40, // Высота для вертикального текста
    justifyContent: "center",
    alignItems: "center",
  },
  verticalText: {
    transform: "rotate(-90deg)",
    whiteSpace: "nowrap",
    textAlign: "center",
    width: 40, // Ширина для ротации
  },
  footer: {
    marginTop: 20,
    textAlign: "right",
  },
  signature: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

// ----------------- PDF Документ -----------------
type ReportShiftDocumentProps = {
  rows: {
    employeeId: string;
    employeeName: string;
    hoursByDate: Record<string, number>;
    totalHours: number;
  }[];
  objectName: string;
};

export const ReportShiftDocument: React.FC<ReportShiftDocumentProps> = ({
  rows,
  objectName,
}) => {
  // Извлечение уникальных дат и сортировка
  const allDates = new Set<string>();
  rows.forEach((row) =>
    Object.keys(row.hoursByDate).forEach((date) => allDates.add(date))
  );
  const sortedDates = Array.from(allDates).sort();

  // Извлечение месяца и года из первой даты (предполагаем формат YYYY-MM-DD)
  const firstDate = sortedDates[0];
  let month = "";
  let year = "";
  if (firstDate) {
    const dateObj = new Date(firstDate);
    month = String(dateObj.getMonth() + 1); // 1-12
    year = String(dateObj.getFullYear());
  }

  // Расчёт итого по дням
  const totalByDate: Record<string, number> = {};
  sortedDates.forEach((date) => {
    totalByDate[date] = rows.reduce(
      (sum, row) => sum + (row.hoursByDate[date] || 0),
      0
    );
  });
  const grandTotal = rows.reduce((sum, row) => sum + row.totalHours, 0);

  // Получение сокращенного дня недели
  const getWeekdayShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      String(
        date.toLocaleString("ru-RU", { weekday: "short" })
      )[0].toUpperCase() +
      date.toLocaleString("ru-RU", { weekday: "short" }).slice(1)
    );
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Заголовки */}
        <View style={styles.header}>
          <Text>месяц: {month}</Text>
          <Text>год: {year}</Text>
          <Text style={styles.title}>{objectName}</Text>
        </View>

        {/* Таблица смен */}
        <View style={styles.table}>
          {/* Заголовок таблицы */}
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
                  {new Date(date).getDate()} {getWeekdayShort(date)}
                </Text>
              </View>
            ))}
            <Text
              style={[
                styles.tableColLast,
                styles.totalCol,
                styles.tableColHeader,
              ]}
            >
              Часы
            </Text>
          </View>

          {/* Строки сотрудников */}
          {rows.map((row, index) => (
            <View key={row.employeeId} style={styles.tableRow} wrap={false}>
              <Text style={[styles.tableCol, styles.numCol]}>{index + 1}</Text>
              <Text style={[styles.tableCol, styles.nameCol]}>
                {row.employeeName}
              </Text>
              {sortedDates.map((date) => (
                <Text key={date} style={[styles.tableCol, styles.dateCol]}>
                  {row.hoursByDate[date] || 0}
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

          {/* Итого по дням */}
          <View style={styles.tableRow} wrap={false}>
            <Text style={[styles.tableColHeader, styles.numCol]} />
            <Text style={[styles.tableColHeader, styles.nameCol]}>
              Итого часов
            </Text>
            {sortedDates.map((date) => (
              <Text key={date} style={[styles.tableColHeader, styles.dateCol]}>
                {totalByDate[date]}
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
        </View>

        {/* Подпись */}
        <View style={styles.signature}>
          <Text>Начальник участка: _________________________</Text>
        </View>
      </Page>
    </Document>
  );
};
