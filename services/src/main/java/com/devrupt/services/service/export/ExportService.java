package com.devrupt.services.service.export;

import java.io.IOException;

public interface ExportService
{
    byte[] export(String processId) throws IOException;
}
