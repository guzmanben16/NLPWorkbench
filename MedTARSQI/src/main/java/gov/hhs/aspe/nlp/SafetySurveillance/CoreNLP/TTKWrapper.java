package gov.hhs.aspe.nlp.SafetySurveillance.CoreNLP;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import gov.hhs.aspe.nlp.SafetySurveillance.Workbench.Temporal.MedTARSQIResultFileReader;

/**
 * This class wraps the initialization of MedTARSQI, and the file manipulations.
 * 
 * @author Wei.Chen & Geoffrey Zhang
 *
 */
public class TTKWrapper {

	// a static ID to be associated with the temporary files
	static long id = 0;

	public TTKWrapper() {
		this.id++;
	}

	/**
	 * This class accepts a raw text (e.g., a clinical note) as input, and
	 * generates a String output that contains the results from MedTARSQI
	 * without file operation.
	 * 
	 * @param rawText
	 * @return
	 * @throws IOException
	 * @throws InterruptedException 
	 */
	public String extract(String rawText) throws IOException, InterruptedException {

		String xmlInput = "<?xml version=\"1.0\"?><xml><TEXT>" + rawText + "</TEXT></xml>";
		String xmlInputFile = "MedTARSQI_Input" + new Long(this.id).toString() + ".xml";
		generateMedTARSQIInputFile(xmlInput, xmlInputFile);

		String xmlOutputFile = new String("MedTARSQI_output" + new Long(this.id).toString() + ".xml");
		Path outputXMLPath = Paths.get(xmlOutputFile);
		Files.deleteIfExists(outputXMLPath);

		URL url = this.getClass().getResource("/ttk/tarsqi.py");
		
		ProcessBuilder pb = new ProcessBuilder("python", url.getPath().toString().substring(1), xmlInputFile, xmlOutputFile);

		pb.redirectErrorStream(true);
		Process p = pb.start();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
		String line;
		while ((line = reader.readLine()) != null)
//		    System.out.println("tasklist: " + line);
		
		p.waitFor();

		String result = new String(Files.readAllBytes(outputXMLPath));

		Files.deleteIfExists(outputXMLPath);
		Path p2 = Paths.get(xmlInputFile);
		Files.deleteIfExists(p2);
		
		return result;
	}

	/**
	 * This function takes the raw text from xmlInput and generate a temporary
	 * file specified by another String input of xmlInputFile.
	 * 
	 * @param xmlInput
	 * @param xmlInputFile
	 * @throws FileNotFoundException
	 */
	public void generateMedTARSQIInputFile(String xmlInput, String xmlInputFile) throws FileNotFoundException {
		PrintWriter fileOut = null;
		fileOut = new PrintWriter(xmlInputFile);
		fileOut.println(xmlInput);
		fileOut.close();
	}

	/**
	 * This function return a String result. 
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	private static String output(InputStream inputStream) throws IOException {
		StringBuilder sb = new StringBuilder();
		BufferedReader br = null;
		try {
			br = new BufferedReader(new InputStreamReader(inputStream));
			String line = null;
			while ((line = br.readLine()) != null) {
				sb.append(line + System.getProperty("line.separator"));
			}
		} finally {
			br.close();
		}
		return sb.toString();
	}

	/**
	 * This function takes an input file - the first parameter - containing
	 * clinical text and embed the textual content in an XML file as specified
	 * in the 2nd parameter.
	 * 
	 * @param inputFile
	 * @param inputXMLFile
	 */
	public void generateXMLContentForInputFile(String inputFile, String inputXMLFile) throws IOException {
//		try {
			Path pathTmp = Paths.get(inputFile);
			String result = new String(Files.readAllBytes(pathTmp));
			String xmlResult = "<?xml version=\"1.0\"?><xml><TEXT>" + result + "</TEXT></xml>";
			// generate/replace the xml file
			PrintWriter fileOut = new PrintWriter(inputXMLFile);
			fileOut.println(xmlResult);
			fileOut.close();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
	}

}