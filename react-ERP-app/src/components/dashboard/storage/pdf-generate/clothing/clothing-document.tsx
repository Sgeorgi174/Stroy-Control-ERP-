import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Clothes } from "@/types/clothes";

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
  nameCell: { flex: 2.5 }, // Для name
  quantityCell: { flex: 1.4 }, // Для quantity
  sizeCell: { flex: 1 }, // Для size
  heightCell: { flex: 1 }, // Для height
  seasonCell: { flex: 1.5 }, // Для season
  manualCell: { flex: 4.3 }, // Для ручного заполнения (пустое)
  bold: { fontWeight: "bold" },
  indent: { marginLeft: 10 }, // Для отступа в подпунктах
  subFooter: {
    marginTop: 4,
    marginBottom: 10,
  },
});

// ----------------- PDF Документ -----------------
export type ClothingDocumentProps = { clothes: Clothes[] };

const date = new Date().toLocaleDateString("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

export const ClothingDocument: React.FC<ClothingDocumentProps> = ({
  clothes,
}) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
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
            {clothes[0].storage.name}
          </Text>

          <Text style={[styles.bold, { fontSize: 12 }]}>Спец одежда/обувь</Text>
        </View>

        {/* Таблица инструментов */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.smallCell, styles.bold, styles.cell]}>№</Text>
            <Text style={[styles.nameCell, styles.bold, styles.cell]}>
              Название
            </Text>
            <Text style={[styles.sizeCell, styles.bold, styles.cell]}>
              Размер
            </Text>
            <Text style={[styles.heightCell, styles.bold, styles.cell]}>
              Ростовка
            </Text>
            <Text style={[styles.seasonCell, styles.bold, styles.cell]}>
              Сезон
            </Text>
            <Text style={[styles.quantityCell, styles.bold, styles.cell]}>
              Кол-во
            </Text>
            <Text style={[styles.manualCell, styles.bold, styles.lastCell]}>
              Ручное заполнение
            </Text>
          </View>
          {clothes.map((item, index) => (
            <React.Fragment key={item.id}>
              {/* Основная строка инструмента */}
              <View style={styles.tableRow}>
                <Text style={[styles.smallCell, styles.cell]}>{index + 1}</Text>
                <Text style={[styles.nameCell, styles.cell, styles.bold]}>
                  {item.name}
                </Text>
                <Text style={[styles.sizeCell, styles.cell]}>
                  {item.type === "CLOTHING"
                    ? item.clothingSize.size
                    : item.footwearSize.size}
                </Text>
                <Text style={[styles.heightCell, styles.cell]}>
                  {item.clothingHeight ? item.clothingHeight.height : "-"}
                </Text>
                <Text style={[styles.seasonCell, styles.cell]}>
                  {item.season === "SUMMER" ? "Лето" : "Зима"}
                </Text>
                <Text style={[styles.quantityCell, styles.cell]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.manualCell, styles.lastCell]} />
                {/* Пустое поле */}
              </View>
            </React.Fragment>
          ))}
        </View>
        <View style={styles.subFooter}>
          <Text style={[styles.bold]}>Итого позиций: {clothes.length}</Text>
          <Text style={[styles.bold]}>
            Итого штук: {clothes.reduce((acc, e) => acc + e.quantity, 0)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
