import AppModal from '@/components/App/AppModal';
import { ConlluToken } from '@/types/model/Conllu';
import './style.scss';

type TokenDetailsProps = {
  token: ConlluToken | null;
  open: boolean;
  onClose: () => void;
};

export default function TokenDetails({
  token,
  open,
  onClose,
}: TokenDetailsProps) {
  return (
    <>
      {open && (
        <AppModal title="Token Details" close={onClose}>
          {token && (
            <div className="token-details-modal">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>
                      <strong>ID</strong>
                    </td>
                    <td>{token.id || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>FORM</strong>
                    </td>
                    <td>{token.form || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>LEMMA</strong>
                    </td>
                    <td>{token.lemma || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>UPOS</strong>
                    </td>
                    <td>{token.upos || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>XPOS</strong>
                    </td>
                    <td>{token.xpos || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>FEATS</strong>
                    </td>
                    <td>{token.feats || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>HEAD</strong>
                    </td>
                    <td>{token.head || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>DEPREL</strong>
                    </td>
                    <td>{token.deprel || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>DEPS</strong>
                    </td>
                    <td>{token.deps || '_'}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>MISC</strong>
                    </td>
                    <td>{token.misc || '_'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </AppModal>
      )}
    </>
  );
}
