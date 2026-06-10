
export interface TestRow {
  id: string;
  section: string;
  type: string;
  test: string;
  comment: string;
  tested: boolean;
}

export interface FOP04Data {
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

export const FOP04_INITIAL: FOP04Data = {
  header: {
    code: 'F OP-04',
    revision: '0',
    validityDate: '2024-05-20',
    client: '',
    workOrder: '',
    description: '',
    program: '',
    name: ''
  },
  tests: [
    { id: '1', section: '', type: '', test: '', comment: '', tested: false }
  ],
  footer: {
    realizadoNombre: '',
    aprobacionAutoNombre: '',
    aprobacionClienteNombre: ''
  }
};
