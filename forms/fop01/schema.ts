export interface FOP01Data {
  header: {
    code: string;
    revision: string;
    validityDate: string;
    client: string;
    projectName: string;
    date: string;
  };
  notes: string;
}

export const FOP01_INITIAL: FOP01Data = {
  header: {
    code: 'F OP-01',
    revision: '0',
    validityDate: '2024-05-20',
    client: '',
    projectName: '',
    date: ''
  },
  notes: ''
};