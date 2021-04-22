package com.devrupt.services.controller.download;

import com.devrupt.services.service.export.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;

@Controller
@RequestMapping(value = "/download")
public class DownloadController
{
    @Autowired
    private ExportService exportService;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/process/{id}")
    public ResponseEntity<StreamingResponseBody> downloadProcessFile(@PathVariable String id) throws IOException, URISyntaxException
    {
        byte[] resource = exportService.export(id);
        String fileName = String.format("output_%s_%s.xlsx", id, System.currentTimeMillis());
        return this.stream(resource, MediaType.APPLICATION_OCTET_STREAM, fileName);
    }

    private ResponseEntity<StreamingResponseBody> stream(byte[] resource, MediaType mediaType, String fileName)
    {
        return ResponseEntity
                .ok()
                .contentType(mediaType)
                .header("Content-Disposition", String.format("inline; filename=\"%s\"", fileName))
                .body(outputStream ->
                {
                    InputStream inputStream = new ByteArrayInputStream(resource);
                    int nRead;
                    byte[] data = new byte[1024];
                    while ((nRead = inputStream.read(data, 0, data.length)) != -1)
                    {
                        outputStream.write(data, 0, nRead);
                    }
                    inputStream.close();
                });
    }
}
