<?xml version="1.0" encoding="UTF-8"?>  
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">  

    <!-- Output as HTML -->  
    <xsl:output method="html" encoding="UTF-8" indent="no"/>  

    <!-- Template matching the custom <export> root element -->  
    <xsl:template match="/export">  
        <div id="transformed-content">  
            <span class="json-braces">{</span>  
            <span class="json-key">"title"</span>: <span class="json-value">"<xsl:value-of select="book/title"/>"</span>,  
            <span class="json-key">"year"</span>: <span class="json-value">"<xsl:value-of select="book/year"/>"</span>,  
            <span class="json-key">"genre"</span>: <span class="json-value">"<xsl:value-of select="book/genre"/>"</span>,  
            <span class="json-key">"price"</span>: <span class="json-value">"<xsl:value-of select="book/price"/>"</span>,  
            <span class="json-key">"summary"</span>: <span class="json-value">"<xsl:value-of select="normalize-space(book/summary)"/>"</span>,  
            <span class="json-key">"author"</span>: <span class="json-braces">{</span>  
            <span class="json-key">"name"</span>: <span class="json-value">"<xsl:value-of select="book/author/name"/>"</span>,  
            <span class="json-key">"bio"</span>: <span class="json-value">"<xsl:value-of select="book/author/bio"/>"</span>  
            <span class="json-braces">}</span>,  
            <span class="json-key">"cover"</span>: <span class="json-value">"<xsl:value-of select="book/cover"/>"</span>  
            <span class="json-braces">}</span>  
        </div>  
    </xsl:template>  

</xsl:stylesheet>
