<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- Template for the root element -->
  <xsl:template match="/export">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Book Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .book-container { border: 1px solid #ccc; padding: 20px; }
          .cover { float: left; margin-right: 20px; }
          .details { overflow: hidden; }
          h1 { margin-top: 0; }
          .author { margin-top: 20px; }
          .clear { clear: both; }
        </style>
      </head>
      <body>
        <div class="book-container">
          <div class="cover">
            <img src="{book/cover}" alt="Book Cover" width="150"/>
          </div>
          <div class="details">
            <h1><xsl:value-of select="book/title"/></h1>
            <p><strong>Year:</strong> <xsl:value-of select="book/year"/></p>
            <p><strong>Genre:</strong> <xsl:value-of select="book/genre"/></p>
            <p><strong>Price:</strong> $<xsl:value-of select="book/price"/></p>
            <p><strong>Summary:</strong></p>
            <p><xsl:value-of select="book/summary"/></p>
          </div>
          <div class="clear"></div>
          <div class="author">
            <h2>About the Author</h2>
            <p><strong>Name:</strong> <xsl:value-of select="book/author/name"/></p>
            <p><strong>Nationality:</strong> <xsl:value-of select="book/author/nationality"/></p>
            <p><strong>Bio:</strong></p>
            <p><xsl:value-of select="book/author/bio"/></p>
            <img src="{book/author/photo}" alt="Author Photo" width="100"/>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
