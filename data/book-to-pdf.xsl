<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:fo="http://www.w3.org/1999/XSL/Format">
  
  <xsl:output method="xml" indent="yes"/>

  <!-- Template matching the <book> element -->
  <xsl:template match="book">
    <fo:root>
      <!-- Define the page layout -->
      <fo:layout-master-set>
        <fo:simple-page-master master-name="simple" 
                               page-height="11in" 
                               page-width="8.5in" 
                               margin="1in">
          <fo:region-body/>
        </fo:simple-page-master>
      </fo:layout-master-set>
      
      <!-- Begin a page sequence -->
      <fo:page-sequence master-reference="simple">
        <fo:flow flow-name="xsl-region-body">
          <!-- Book Title -->
          <fo:block font-size="24pt" font-weight="bold" text-align="center" space-after="12pt">
            <xsl:value-of select="title"/>
          </fo:block>
          
          <!-- Book Cover Image -->
          <fo:block text-align="center" space-after="12pt">
            <fo:external-graphic src="{cover}" content-width="3in"/>
          </fo:block>
          
          <!-- Author Information -->
          <fo:block space-after="8pt">
            <fo:inline font-weight="bold">Author: </fo:inline>
            <xsl:value-of select="author/name"/>
          </fo:block>
          
          <!-- Publication Year -->
          <fo:block space-after="8pt">
            <fo:inline font-weight="bold">Year: </fo:inline>
            <xsl:value-of select="year"/>
          </fo:block>
          
          <!-- Genre -->
          <fo:block space-after="8pt">
            <fo:inline font-weight="bold">Genre: </fo:inline>
            <xsl:value-of select="genre"/>
          </fo:block>
          
          <!-- Price -->
          <fo:block space-after="8pt">
            <fo:inline font-weight="bold">Price: </fo:inline>
            <xsl:value-of select="price"/>
          </fo:block>
          
          <!-- Summary / Description -->
          <fo:block space-before="12pt" space-after="12pt">
            <fo:inline font-weight="bold">Summary: </fo:inline>
            <xsl:value-of select="summary"/>
          </fo:block>
          
          <!-- Author Photo -->
          <fo:block text-align="center" space-before="12pt">
            <fo:external-graphic src="{author/photo}" content-width="2in"/>
          </fo:block>
          
          <!-- Author Bio -->
          <fo:block text-align="center" space-before="8pt">
            <fo:inline font-weight="bold">About the Author: </fo:inline>
            <xsl:value-of select="author/bio"/>
          </fo:block>
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
  
  <!-- Template to clean up extra whitespace -->
  <xsl:template match="text()">
    <xsl:value-of select="normalize-space(.)"/>
  </xsl:template>

</xsl:stylesheet>
