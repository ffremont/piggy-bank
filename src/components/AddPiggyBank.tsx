type AddPiggyBankProps = {
    onClick: () => void
}

export const AddPiggyBank = ({onClick} : AddPiggyBankProps) => <div onClick={onClick} className="piggy-bank default">
<span className="my-icon material-symbols-outlined">add_box</span>

<span className="amount">Créer</span>
</div>