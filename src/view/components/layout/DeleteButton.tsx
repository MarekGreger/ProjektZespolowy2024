import { Button } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
interface Props {
    onClick: () => void;
}
const DeleteButton: React.FC<Props> = ({ onClick }) => {
    return (
        <Button
            color="error"
            variant="outlined"
            startIcon={<DeleteForeverIcon />}
            onClick={onClick}
        >
            Usuń
        </Button>
    );
};

export default DeleteButton;
