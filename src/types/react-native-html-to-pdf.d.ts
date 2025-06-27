declare module 'react-native-html-to-pdf' {
  interface ConvertOptions {
    html: string;
    fileName: string;
    base64?: boolean;
    directory?: string;
  }

  interface ConvertResult {
    filePath: string;
  }

  export default class RNHTMLtoPDF {
    static convert(options: ConvertOptions): Promise<ConvertResult>;
    static getDocumentsDirectory(): string;
  }
} 