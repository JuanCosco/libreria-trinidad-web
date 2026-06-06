import jsPDF from "jspdf";
import { Order } from "@/types";

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Librería Trinidad", margin, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Tu tienda de libros online", margin, y);

  // Línea separadora
  y += 8;
  doc.setDrawColor(200);
  doc.line(margin, y, 210 - margin, y);

  // Info de la orden
  y += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("Detalle de Orden", margin, y);

  y += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.text(`ID: ${order.id}`, margin, y);

  y += 6;
  doc.text(
    `Fecha: ${new Date(order.fecha).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin,
    y,
  );

  y += 6;
  const statusMap: Record<string, string> = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    CANCELLED: "Cancelado",
  };
  doc.text(`Estado: ${statusMap[order.status] ?? order.status}`, margin, y);

  // Tabla de items
  y += 12;
  doc.setDrawColor(200);
  doc.line(margin, y, 210 - margin, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("Libro", margin, y);
  doc.text("Cant.", 120, y);
  doc.text("Precio unit.", 140, y);
  doc.text("Subtotal", 175, y);

  y += 4;
  doc.line(margin, y, 210 - margin, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40);

  order.items.forEach((item) => {
    y += 8;
    const subtotal = Number(item.precioSnapshot) * item.cantidad;

    // Truncar nombre si es muy largo
    const nombre =
      item.nombreSnapshot.length > 40
        ? item.nombreSnapshot.slice(0, 37) + "..."
        : item.nombreSnapshot;

    doc.text(nombre, margin, y);
    doc.text(String(item.cantidad), 122, y);
    doc.text(`S/ ${Number(item.precioSnapshot).toFixed(2)}`, 140, y);
    doc.text(`S/ ${subtotal.toFixed(2)}`, 175, y);
  });

  // Línea y total
  y += 6;
  doc.setDrawColor(200);
  doc.line(margin, y, 210 - margin, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("Total", 140, y);
  doc.text(`S/ ${Number(order.total).toFixed(2)}`, 175, y);

  // Footer
  y += 20;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150);
  doc.text("Gracias por tu compra — Librería Trinidad", margin, y);

  // Descargar
  doc.save(`orden-${order.id.slice(0, 8)}.pdf`);
};
