package com.devrupt.services.service.export;

import com.devrupt.services.dto.integration.CustomerLifetimeValueDto;
import com.devrupt.services.dto.integration.CustomerLifetimeValueFilter;
import com.devrupt.services.service.integration.IntegrationService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExportServiceImpl implements ExportService
{
    @Autowired
    private IntegrationService integrationService;

    @Override
    public byte[] export(String processId) throws IOException
    {
        List<CustomerLifetimeValueDto> getCustomerLifetimeValueList =
                integrationService.getCustomerLifetimeValueList(CustomerLifetimeValueFilter
                        .builder()
                        .processId(processId)
                        .build());


        return writeExcel(getCustomerLifetimeValueList);
    }

    public byte[] writeExcel(List<CustomerLifetimeValueDto> customerLifetimeValueList) throws IOException
    {
        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Data");

        int rowCount = 0;

        String[] headers = new String[] {"Guest ID", "First Name", "Last Name", "Email", "CLV Class", "Low", "Mid", "High", "Type"};
        Row headerRow = sheet.createRow(rowCount++);
        for (int i = 0; i < headers.length; i++)
        {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        for (CustomerLifetimeValueDto customerLifetimeValue : customerLifetimeValueList)
        {
            Row row = sheet.createRow(rowCount++);
            writeBooking(customerLifetimeValue, row);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        outputStream.close();
        workbook.close();
        return outputStream.toByteArray();
    }

    private void writeBooking(CustomerLifetimeValueDto data, Row row)
    {
        int i = 0;

        Cell cell;
        String cellValue;

        cellValue = data.getGuestId() != null ? data.getGuestId() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

        cellValue = data.getFirstName() != null ? data.getFirstName() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

        cellValue = data.getLastName() != null ? data.getLastName() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

        cellValue = data.getEmail() != null ? data.getEmail() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

        cellValue = data.getLtvClass() != null ? data.getLtvClass().toString() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

        cellValue = data.getLow() != null ? data.getLow().toString() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

        cellValue = data.getMid() != null ? data.getMid().toString() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

        cellValue = data.getHigh() != null ? data.getHigh().toString() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

        cellValue = data.getType() != null ? data.getType() : "";
        cell = row.createCell(i++);
        cell.setCellValue(cellValue);

    }
}
