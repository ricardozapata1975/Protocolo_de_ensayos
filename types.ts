
export interface TestRow {
  id: string;
  section: string;
  type: string;
  test: string;
  comment: string;
  tested: boolean;
}

export interface ProtocolData {
  header: {
    code: string;
    revision: string;
    validityDate: string;
    client: string;
    workOrder: string;
    description: string;
    program: string;
    name: string;
  };
  tests: TestRow[];
  footer: {
    realizadoNombre: string;
    aprobacionAutoNombre: string;
    aprobacionClienteNombre: string;
  };
}
