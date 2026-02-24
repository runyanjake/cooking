# cooking
A content-first recipe site. See it in action [HERE](https://recipes.whitney.rip).

## Build
```bash
docker compose down && docker system prune && docker compose up -d --build && docker logs -f recipes
```