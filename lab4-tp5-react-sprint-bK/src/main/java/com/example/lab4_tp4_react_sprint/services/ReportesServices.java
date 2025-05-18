package com.example.lab4_tp4_react_sprint.services;

import com.example.lab4_tp4_react_sprint.DAO.PedidoDAO;
import com.example.lab4_tp4_react_sprint.models.Instrumento;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

@Service
public class ReportesServices {
    private final PedidoDAO pedidoRepository;
    private final InstrumentoServicio instrumentoServicio;

    @Autowired
    public ReportesServices(PedidoDAO pedidoRepository, InstrumentoServicio instrumentoServicio) {
        this.pedidoRepository = pedidoRepository;
        this.instrumentoServicio = instrumentoServicio;
    }

    // --- Método para obtener datos de cantidad de pedidos por mes y año (Sin DTO) ---
    // Ahora devuelve directamente List<Object[]>
    public List<Object[]> getPedidosCountByMonthAndYear() {
        // Simplemente llama al repositorio y devuelve el resultado
        return pedidoRepository.countPedidosByMonthAndYear();
        // Ya no hay lógica para mapear a DTOs aquí
    }

    // --- Nuevo método para obtener la cantidad total vendida por instrumento ---
    // Devuelve directamente List<Object[]> donde cada Object[] es [String nombreInstrumento, Long cantidadVendida]
    public List<Object[]> getCantidadVendidaByInstrumento() {
        return pedidoRepository.sumCantidadVendidaByInstrumento();
    }

    // --- Nuevo método para generar el reporte Excel ---
    public byte[] generarExcelReport(Date fechaDesde, Date fechaHasta) throws IOException { // El método puede lanzar IOException

        //  Obtener los datos del repositorio, filtrados por fecha

        List<Object[]> pedidoDetails = pedidoRepository.findPedidoDetailsByFechaPedidoBetween(fechaDesde, fechaHasta);

        //  Crear un nuevo libro de Excel (Workbook) - Usamos XSSFWorkbook para .xlsx
        try (Workbook workbook = new XSSFWorkbook()) { // Usamos try-with-resources para asegurar que se cierre el workbook
            Sheet sheet = workbook.createSheet("Reporte de Pedidos"); // Crear una nueva hoja

            // 3. Definir los encabezados de las columnas
            String[] headers = {"Fecha Pedido", " Marca Instrumento", "Modelo", "Cantidad", "Precio", "Subtotal"};
            Row headerRow = sheet.createRow(0); // Crear la fila de encabezados en la primera fila (índice 0)

            // Crear estilos si es necesario (ej. para fechas, moneda)
            CellStyle dateCellStyle = workbook.createCellStyle();
            CreationHelper createHelper = workbook.getCreationHelper();
            dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/mm/yyyy ")); // Formato de fecha/hora (ajusta si solo necesitas fecha)

            // Estilo para moneda (ej. con símbolo de dólar)
            CellStyle currencyCellStyle = workbook.createCellStyle();
            currencyCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("$#,##0.00")); // Formato de moneda (ajusta según tu necesidad)


            // Llenar la fila de encabezados
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                // Opcional: aplicar estilo a los encabezados (ej. negrita)
            }

            // 4. Llenar el cuerpo del reporte con los datos obtenidos
            int rowNum = 1; // Empezar desde la segunda fila (índice 1) para los datos
            for (Object[] detail : pedidoDetails) {
                Row row = sheet.createRow(rowNum++); // Crear una nueva fila para cada detalle

                // Asegúrate de que los tipos de datos coincidan con lo que devuelve tu consulta findPedidoDetailsByFechaPedidoBetween
                // Indices del array Object[]: 0=fecha, 1=marca, 2=modelo, 3=cantidad, 4=precio, 5=subtotal (calculado en JPQL)

                // Celda 0: Fecha Pedido (Date/Timestamp/LocalDate/LocalDateTime)
                Cell dateCell = row.createCell(0);
                // Necesitas saber el tipo exacto que devuelve la consulta para la fecha (Date, Timestamp, LocalDate, etc.)
                // Si es Date o Timestamp:
                if (detail[0] instanceof Date) {
                    dateCell.setCellValue((Date) detail[0]);
                    dateCell.setCellStyle(dateCellStyle); // Aplicar estilo de fecha
                }
                // Si es java.time.LocalDate:
                // if (detail[0] instanceof java.time.LocalDate) {
                //     java.time.LocalDate localDate = (java.time.LocalDate) detail[0];
                //     dateCell.setCellValue(java.util.Date.from(localDate.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant()));
                //     dateCell.setCellStyle(dateCellStyle);
                // }
                // Si es java.time.LocalDateTime:
                // if (detail[0] instanceof java.time.LocalDateTime) {
                //    java.time.LocalDateTime localDateTime = (java.time.LocalDateTime) detail[0];
                //     dateCell.setCellValue(java.util.Date.from(localDateTime.atZone(java.time.ZoneId.systemDefault()).toInstant()));
                //     dateCell.setCellStyle(dateCellStyle);
                // }


                // Celda 1: Instrumento Marca (String)
                row.createCell(1).setCellValue((String) detail[1]);

                // Celda 2: Modelo (String)
                row.createCell(2).setCellValue((String) detail[2]);

                // Celda 3: Cantidad (Integer/Long)
                // Asumo que la cantidad es un número, lo convertimos a double para setCellValue
                if (detail[3] != null) {
                    if (detail[3] instanceof Number) {
                        row.createCell(3).setCellValue(((Number) detail[3]).doubleValue());
                    } else {
                        // Intentar parsear si no es Number (menos común)
                        try {
                            row.createCell(3).setCellValue(Double.parseDouble(detail[3].toString()));
                        } catch (NumberFormatException e) {
                            row.createCell(3).setCellValue(detail[3].toString()); // Si falla, poner como texto
                        }
                    }
                } else {
                    row.createCell(3).setCellValue(0); // O dejar en blanco si es null
                }


                // Celda 4: Precio (Double/BigDecimal)
                if (detail[4] != null) {
                    if (detail[4] instanceof Number) {
                        Cell priceCell = row.createCell(4);
                        priceCell.setCellValue(((Number) detail[4]).doubleValue());
                        priceCell.setCellStyle(currencyCellStyle); // Aplicar estilo de moneda
                    } else {
                        try {
                            Cell priceCell = row.createCell(4);
                            priceCell.setCellValue(Double.parseDouble(detail[4].toString()));
                            priceCell.setCellStyle(currencyCellStyle);
                        } catch (NumberFormatException e) {
                            row.createCell(4).setCellValue(detail[4].toString());
                        }
                    }
                } else {
                    Cell priceCell = row.createCell(4);
                    priceCell.setCellValue(0.0);
                    priceCell.setCellStyle(currencyCellStyle);
                }


                // Celda 5: Subtotal (Double/BigDecimal - calculado en la consulta)
                if (detail[5] != null) {
                    if (detail[5] instanceof Number) {
                        Cell subtotalCell = row.createCell(5);
                        subtotalCell.setCellValue(((Number) detail[5]).doubleValue());
                        subtotalCell.setCellStyle(currencyCellStyle); // Aplicar estilo de moneda
                    } else {
                        try {
                            Cell subtotalCell = row.createCell(5);
                            subtotalCell.setCellValue(Double.parseDouble(detail[5].toString()));
                            subtotalCell.setCellStyle(currencyCellStyle);
                        } catch (NumberFormatException e) {
                            row.createCell(5).setCellValue(detail[5].toString());
                        }
                    }
                } else {
                    Cell subtotalCell = row.createCell(5);
                    subtotalCell.setCellValue(0.0);
                    subtotalCell.setCellStyle(currencyCellStyle);
                }

            }

            // Opcional: Ajustar automáticamente el ancho de las columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }


            // Escribir el contenido del libro a un ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            // Devolver el contenido como un array de bytes
            return outputStream.toByteArray();

        } catch (IOException ex) {
            // Manejar la excepción de escritura (loguear, lanzar una excepción personalizada, etc.)
            ex.printStackTrace(); // Imprimir la traza por ahora
            throw ex; // Relanzar la excepción o lanzar una nueva
        }
    }



    public byte[] generateInstrumentoPdf(int instrumentoId) throws IOException { // Ajusta el tipo del ID

        Instrumento instrumento = instrumentoServicio.getInstrumentoById(instrumentoId);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdfDocument = new PdfDocument(writer);
        Document document = new Document(pdfDocument);

        try {
            // 3. Añadir contenido al PDF
            // ... (Código para añadir Título e Información del Instrumento como texto) ...

            // Título
            document.add(new Paragraph("Ficha Técnica del Instrumento"));
            document.add(new Paragraph("\n")); // Línea en blanco

            // --- Lógica para añadir la Imagen ---
            String imagePath = instrumento.getImagen(); // Asumo que getImagen() devuelve la ruta/nombre del archivo de imagen

            // Define la ruta base donde se encuentran tus imágenes en el servidor backend
            // AJUSTA ESTA RUTA SEGÚN DONDE ESTÁN LAS IMÁGENES EN TU PROYECTO BACKEND
            String FRONT_IMG_DIR = "../lab4-tp5-react-sprint-front/public/img";
            if (imagePath != null && !imagePath.isEmpty()) {
                // Combina la ruta base con el nombre/ruta de imagen de la entidad
                java.nio.file.Path fullImagePath = Paths.get(FRONT_IMG_DIR, imagePath);

                // Verifica si el archivo de imagen existe
                if (Files.exists(fullImagePath)) {
                    try {
                        // Cargar la imagen usando iText desde el archivo
                        ImageData imageData = ImageDataFactory.create(fullImagePath.toString());
                        Image image = new Image(imageData);

                        // --- Opcional: Ajustar tamaño o posición de la imagen ---
                        // image.scaleToFit(AnchoMaximo, AltoMaximo); // Escalar para que quepa
                        // image.setHorizontalAlignment(HorizontalAlignment.CENTER); // Centrar imagen
                        // -------------------------------------------------------

                        // Añadir la imagen al documento
                        document.add(image);

                    } catch (IOException imgEx) {
                        // Manejar error si la imagen no se puede leer
                        System.err.println("Error al cargar o añadir la imagen del instrumento " + instrumentoId + ": " + imgEx.getMessage());
                        imgEx.printStackTrace();
                        // Puedes añadir un texto placeholder en el PDF si la imagen falla
                        document.add(new Paragraph("(Imagen no disponible)"));
                    }
                } else {
                    System.err.println("Archivo de imagen no encontrado para el instrumento " + instrumentoId + " en la ruta: " + fullImagePath.toString());
                    document.add(new Paragraph("(Imagen no encontrada)"));
                }
            } else {
                System.out.println("No hay ruta de imagen definida para el instrumento " + instrumentoId);
                document.add(new Paragraph("(Imagen no especificada)"));
            }
            // ---------------------------------------

            // Añadir un poco de espacio después de la imagen antes de la info de texto
            document.add(new Paragraph("\n"));


            // Información del Instrumento (texto)
            document.add(new Paragraph("Nombre: ").add(new Text(instrumento.getNombre())));
            // ... (resto de la información de texto como Marca, Modelo, Precio, etc.) ...
            document.add(new Paragraph("Marca: ").add(new Text(instrumento.getMarca())));
            document.add(new Paragraph("Modelo: ").add(new Text(instrumento.getModelo()))); // Asegúrate de que este getter sea correcto
            document.add(new Paragraph("Precio: $").add(new Text(String.valueOf(instrumento.getPrecio()))));
            document.add(new Paragraph("Cantidad Vendida: ").add(new Text(String.valueOf(instrumento.getCantidadVendida()))));
            document.add(new Paragraph("Costo Envío: ").add(new Text(instrumento.getCostoEnvio())));
            document.add(new Paragraph("Categoría: ").add(new Text(instrumento.getCategoriaInstrumento() != null ? instrumento.getCategoriaInstrumento().getDenominacion() : "Sin Categoría")));

            // Descripción
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Descripción:"));
            document.add(new Paragraph(instrumento.getDescripcion()));


            // 4. Cerrar el documento
            document.close();

        } catch (
                Exception e) { // Captura excepciones generales, RuntimeException de getInstrumentoById, e IOExcepciones
            e.printStackTrace();
            // Asegurarse de cerrar el documento en caso de error
            if (document != null && pdfDocument != null && !pdfDocument.isClosed()) { // Verificar que los objetos no sean null y no estén cerrados
                document.close();
            }
            // Relanzar como IOException o una excepción personalizada
            throw new IOException("Error generating PDF for instrument " + instrumentoId + ": " + e.getMessage(), e);
        }


        // 5. Devolver el contenido como un array de bytes
        return outputStream.toByteArray();
    }
}