import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Employee } from "@/types/employee";

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
    fontSize: 10,
    fontFamily: "OpenSans",
    flexDirection: "column",
  },
  section: { marginBottom: 8 },
  tableTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  table: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 1,
  },
  subRow: {
    flexDirection: "row",
    paddingVertical: 1,
    backgroundColor: "#f9f9f9", // Легкий фон для выделения подпунктов
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  lastCell: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  smallCell: { flex: 0.3 }, // Для №
  nameCell: { flex: 5 }, // Для ФИО
  position: { flex: 2.5 }, // Для должности
  phoneNumber: { flex: 1.4 }, // Для description (расширен для bagItems)
  workPlace: { flex: 2.8 }, // Для ручного заполнения (пустое)
  bold: { fontWeight: "bold" },
  indent: { marginLeft: 10 }, // Для отступа в подпунктах
  subFooter: {
    marginTop: 4,
    marginBottom: 10,
  },
});

const ROWS_PER_PAGE = 26;

// ----------------- PDF Документ -----------------
export type EmployeesDocumentProps = { employees: Employee[] };

const date = new Date().toLocaleDateString("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

export const EmployeesBulkDocument: React.FC<EmployeesDocumentProps> = ({
  employees,
}) => {
  const pages = Array.from(
    { length: Math.ceil(employees.length / ROWS_PER_PAGE) },
    (_, i) => employees.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE),
  );

  return (
    <Document>
      {pages.map((pageEmployees, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          orientation="landscape"
          style={styles.page}
        >
          {/* Верхний заголовок */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.bold, { fontSize: 12 }]}>
              {date} · Список сотрудников
            </Text>
            <Text style={{ fontSize: 9 }}>Лист {pageIndex + 1}</Text>
          </View>

          {/* Таблица */}
          <View style={styles.table}>
            {/* Шапка таблицы — на каждом листе */}
            <View style={styles.tableHeader} wrap={false}>
              <Text style={[styles.smallCell, styles.bold, styles.cell]}>
                №
              </Text>
              <Text style={[styles.nameCell, styles.bold, styles.cell]}>
                ФИО
              </Text>
              <Text style={[styles.position, styles.bold, styles.cell]}>
                Должность
              </Text>
              <Text style={[styles.phoneNumber, styles.bold, styles.cell]}>
                Телефон
              </Text>
              <Text style={[styles.workPlace, styles.bold, styles.lastCell]}>
                Объект
              </Text>
            </View>

            {/* Строки */}
            {pageEmployees.map((employee, i) => (
              <View key={employee.id} style={styles.tableRow} wrap={false}>
                <Text style={[styles.smallCell, styles.cell]}>
                  {pageIndex * ROWS_PER_PAGE + i + 1}
                </Text>

                <Text style={[styles.nameCell, styles.cell, styles.bold]}>
                  {`${employee.lastName} ${employee.firstName} ${employee.fatherName}`}
                </Text>

                <Text style={[styles.position, styles.cell]}>
                  {employee.position}
                </Text>

                <Text style={[styles.phoneNumber, styles.cell]}>
                  {employee.phoneNumber}
                </Text>

                <Text style={[styles.workPlace, styles.lastCell]}>
                  {employee.workPlace ? employee.workPlace.name : "Не назначен"}
                </Text>
              </View>
            ))}
          </View>

          {/* Итог — только на последнем листе */}
          {pageIndex === pages.length - 1 && (
            <View style={styles.subFooter}>
              <Text style={styles.bold}>ИТОГО: {employees.length}</Text>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};
