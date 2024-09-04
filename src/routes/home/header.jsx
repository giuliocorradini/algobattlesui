import { Link } from "react-router-dom"
import { SwordsIcon } from "lucide-react"
import { AccountButton } from "../../components/accountbutton"
import { SearchBar } from "../../components/search"

export default function Header({user, setResults}) {
    return <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold">
            <SwordsIcon className="h-6 w-6" />
            AlgoBattles
        </Link>
        <SearchBar setResults={setResults}/>
        <AccountButton username={user.username} email={user.email} picture={user.picture}></AccountButton>
    </header>
}

export function HeaderNoSearch({user}) {
    return <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold">
            <SwordsIcon className="h-6 w-6" />
            AlgoBattles
        </Link>
        <AccountButton username={user.username} email={user.email} picture={user.picture}></AccountButton>
    </header>
}