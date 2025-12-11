import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Shift } from "@/types/shift";
import type { Object } from "@/types/object";

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
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  lastCell: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  }, // Последняя ячейка без правой границы
  smallCell: { flex: 0.6 }, // Для № (узкий)
  nameCell: { flex: 2.5 }, // Для ФИО (расширен, так как без должности)
  statusCell: { flex: 5.9 }, // Для статуса/задания (расширен для компенсации)
  bold: { fontWeight: "bold" },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subFooter: {
    marginTop: 4,
    marginBottom: 10,
  },
});

// ----------------- PDF Документ -----------------
type ShiftDocumentProps = { shift: Shift; object: Object };

export const ShiftDocumentForForeman: React.FC<ShiftDocumentProps> = ({
  shift,
  object,
}) => {
  const date = new Date(shift.shiftDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const presentEmployees = shift.employees
    .filter((e) => e.present)
    .sort((a, b) =>
      a.employee.lastName.localeCompare(b.employee.lastName, "ru")
    );

  const absentEmployees = shift.employees
    .filter((e) => !e.present)
    .sort((a, b) =>
      a.employee.lastName.localeCompare(b.employee.lastName, "ru")
    );

  return (
    <Document>
      {/* Первая страница: Присутствующие */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={[styles.bold, { fontSize: 12 }]}>
            {date} {object.name}
          </Text>
        </View>

        {/* Таблица для присутствующих */}
        <Text style={styles.tableTitle}>Присутствующие</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.smallCell, styles.bold, styles.cell]}>№</Text>
            <Text style={[styles.nameCell, styles.bold, styles.cell]}>ФИО</Text>
            <Text style={[styles.statusCell, styles.bold, styles.lastCell]}>
              Развод
            </Text>
          </View>
          {presentEmployees.map((e, index) => {
            const status = e.task || "-";
            return (
              <View style={styles.tableRow} key={e.id}>
                <Text style={[styles.smallCell, styles.cell]}>{index + 1}</Text>
                <Text style={[styles.nameCell, styles.cell, styles.bold]}>
                  {e.employee.lastName} {e.employee.firstName.charAt(0)}.
                  {e.employee.fatherName.charAt(0)}.
                </Text>
                <Text style={[styles.statusCell, styles.lastCell]}>
                  {status}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.subFooter}>
          <Text style={[styles.bold]}>ИТОГО: {presentEmployees.length}</Text>
        </View>
      </Page>

      {/* Вторая страница: Отсутствующие */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={[styles.bold, { fontSize: 12 }]}>
            {date} {object.name}
          </Text>
        </View>

        {/* Таблица для отсутствующих */}
        <Text style={styles.tableTitle}>Отсутствующие</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.smallCell, styles.bold, styles.cell]}>№</Text>
            <Text style={[styles.nameCell, styles.bold, styles.cell]}>ФИО</Text>
            <Text style={[styles.statusCell, styles.bold, styles.lastCell]}>
              Причина
            </Text>
          </View>
          {absentEmployees.map((e, index) => {
            const status = e.absenceReason || "-";
            return (
              <View style={styles.tableRow} key={e.id}>
                <Text style={[styles.smallCell, styles.cell]}>{index + 1}</Text>
                <Text style={[styles.nameCell, styles.cell, styles.bold]}>
                  {e.employee.lastName} {e.employee.firstName.charAt(0)}.
                  {e.employee.fatherName.charAt(0)}.
                </Text>
                <Text style={[styles.statusCell, styles.lastCell]}>
                  {status}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.subFooter}>
          <Text style={[styles.bold]}>ИТОГО: {absentEmployees.length}</Text>
        </View>
      </Page>
    </Document>
  );
};
