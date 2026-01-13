import { Conllu } from './Conllu';

type SentenceItem = {
  conllu: Conllu;
  text: string;
  textStatus: string;
  index: number;
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'done':
      return 'var(--color-primary)';
    case 'review':
      return 'var(--color-warning)';
    default:
      return 'var(--color-disabled)';
  }
};

export default SentenceItem;
