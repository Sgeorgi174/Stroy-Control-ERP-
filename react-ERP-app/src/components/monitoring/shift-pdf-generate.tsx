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
    padding: 10,
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
    paddingVertical: 1, // Уменьшено для снижения высоты
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 1, // Уменьшено для снижения высоты
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    paddingHorizontal: 4,
    paddingVertical: 1, // Уменьшено для снижения высоты
  },
  lastCell: {
    paddingHorizontal: 4,
    paddingVertical: 1, // Уменьшено для снижения высоты
  }, // Последняя ячейка без правой границы
  smallCell: { flex: 0.6 }, // Для № (узкий)
  nameCell: { flex: 2 }, // Для ФИО (средний)
  positionCell: { flex: 1.8 }, // Для Должности (средний, короче)
  statusCell: { flex: 4.8 }, // Для статуса/задания (широкий)
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

export const ShiftDocument: React.FC<ShiftDocumentProps> = ({
  shift,
  object,
}) => {
  const date = new Date(shift.shiftDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const presentEmployees = shift.employees.filter((e) => e.present);
  const absentEmployees = shift.employees.filter((e) => !e.present);

  return (
    <Document>
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
            <Text style={[styles.positionCell, styles.bold, styles.cell]}>
              Должность
            </Text>
            <Text style={[styles.statusCell, styles.bold, styles.lastCell]}>
              Развод
            </Text>
          </View>
          {presentEmployees.map((e, index) => {
            const status = e.task || "-";
            const position = e.employee.position || "-";
            return (
              <View style={styles.tableRow} key={e.id}>
                <Text style={[styles.smallCell, styles.cell]}>{index + 1}</Text>
                <Text style={[styles.nameCell, styles.cell, styles.bold]}>
                  {e.employee.lastName} {e.employee.firstName.charAt(0)}.
                  {e.employee.fatherName.charAt(0)}.
                </Text>
                <Text style={[styles.positionCell, styles.cell]}>
                  {position}
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

        {/* Таблица для отсутствующих */}
        <Text style={styles.tableTitle}>Отсутствующие</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.smallCell, styles.bold, styles.cell]}>№</Text>
            <Text style={[styles.nameCell, styles.bold, styles.cell]}>ФИО</Text>
            <Text style={[styles.positionCell, styles.bold, styles.cell]}>
              Должность
            </Text>
            <Text style={[styles.statusCell, styles.bold, styles.lastCell]}>
              Причина
            </Text>
          </View>
          {absentEmployees.map((e, index) => {
            const status = e.absenceReason || "-";
            const position = e.employee.position || "-";
            return (
              <View style={styles.tableRow} key={e.id}>
                <Text style={[styles.smallCell, styles.cell]}>{index + 1}</Text>
                <Text style={[styles.nameCell, styles.cell, styles.bold]}>
                  {e.employee.lastName} {e.employee.firstName.charAt(0)}.
                  {e.employee.fatherName.charAt(0)}.
                </Text>
                <Text style={[styles.positionCell, styles.cell]}>
                  {position}
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
