import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Tool } from "@/types/tool"; // Предполагая тип Tool в вашем проекте

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
  nameCell: { flex: 2.5 }, // Для name
  quantity: { flex: 1.2 }, // Для quantity
  descCell: { flex: 3 }, // Для description (расширен для bagItems)
  commentCell: { flex: 1.5 }, // Для comment
  manualCell: { flex: 3.5 }, // Для ручного заполнения (пустое)
  bold: { fontWeight: "bold" },
  indent: { marginLeft: 10 }, // Для отступа в подпунктах
  subFooter: {
    marginTop: 4,
    marginBottom: 10,
  },
});

// ----------------- PDF Документ -----------------
export type ToolDocumentProps = { tools: Tool[] };

const date = new Date().toLocaleDateString("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

export const ToolBulkDocument: React.FC<ToolDocumentProps> = ({ tools }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <Text style={[styles.bold, { fontSize: 12, marginRight: 12 }]}>
            {date}
          </Text>
          <Text style={[styles.bold, { fontSize: 12, marginRight: 12 }]}>
            {tools[0].storage.name}
          </Text>

          <Text style={[styles.bold, { fontSize: 12 }]}>
            Групповые инструменты
          </Text>
        </View>

        {/* Таблица инструментов */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.smallCell, styles.bold, styles.cell]}>№</Text>
            <Text style={[styles.nameCell, styles.bold, styles.cell]}>
              Название
            </Text>
            <Text style={[styles.quantity, styles.bold, styles.cell]}>
              Кол-во
            </Text>
            <Text style={[styles.descCell, styles.bold, styles.cell]}>
              Описание
            </Text>
            <Text style={[styles.commentCell, styles.bold, styles.cell]}>
              Комм.
            </Text>
            <Text style={[styles.manualCell, styles.bold, styles.lastCell]}>
              Ручное заполнение
            </Text>
          </View>
          {tools.map((tool, index) => (
            <React.Fragment key={tool.id}>
              {/* Основная строка инструмента */}
              <View style={styles.tableRow}>
                <Text style={[styles.smallCell, styles.cell]}>{index + 1}</Text>
                <Text style={[styles.nameCell, styles.cell, styles.bold]}>
                  {tool.name}
                </Text>
                <Text style={[styles.quantity, styles.cell]}>
                  {tool.quantity}
                </Text>
                <Text style={[styles.descCell, styles.cell]}>
                  {tool.description}
                </Text>
                <Text style={[styles.commentCell, styles.cell]}>
                  {tool.comment || "-"}
                </Text>
                <Text style={[styles.manualCell, styles.lastCell]} />
                {/* Пустое поле */}
              </View>
              {/* Подпункты для bagItems, если isBag */}
              {tool.isBag &&
                tool.bagItems.map((item) => (
                  <View style={styles.subRow} key={item.id}>
                    <Text style={[styles.smallCell, styles.cell]} />
                    {/* Пустой № */}
                    <Text style={[styles.nameCell, styles.cell]}>
                      <Text style={styles.indent}> - {item.name}</Text>
                    </Text>
                    <Text style={[styles.descCell, styles.cell]}>
                      Количество: {item.quantity}
                    </Text>
                    <Text style={[styles.commentCell, styles.cell]} />
                    <Text style={[styles.manualCell, styles.lastCell]} />
                  </View>
                ))}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.subFooter}>
          <Text style={[styles.bold]}>ИТОГО: {tools.length}</Text>
        </View>
      </Page>
    </Document>
  );
};
