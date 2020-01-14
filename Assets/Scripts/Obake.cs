using UnityEngine;
using UnityEngine.EventSystems;

public class Obake : MonoBehaviour
{
    private Vector3 nowPos;

    private bool isMoving = false;
    private Camera mainCamera;
    private RaycastHit hit;

    public int size;
    public int id;
    public int owner;
    public int[] nowXY = { -1, -1 };

    Board board = Board.GetInstance();

    // Use this for initialization
    void Start()
    {
        mainCamera = Camera.main;
        nowPos = transform.position;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            RayCheck();
        }

        if (isMoving)
        {
            MovePoisition();
            if (Input.GetMouseButtonUp(0))
            {
                CommitPosition();
                isMoving = false;
            }
        }

    }

    private void RayCheck()
    {
        Ray ray = mainCamera.ScreenPointToRay(Input.mousePosition);

        if (Physics.Raycast(ray.origin, ray.direction, out hit, Mathf.Infinity) && hit.collider == gameObject.GetComponent<Collider>())
        {
            if (board.canMove(this))
            {
                isMoving = true;
            }
        }
        else
        {
            isMoving = false;
        }

    }

    private void MovePoisition()
    {
        transform.position = GetMousePosition();
    }
    private Vector3 GetMousePosition()
    {
        Vector3 mousePos = Input.mousePosition;
        Ray touchPointToRay = mainCamera.ScreenPointToRay(mousePos);
        Vector3 p = nowPos;
        if (Physics.Raycast(touchPointToRay, out hit, Mathf.Infinity, ~(1<<8)))
        {
            p = hit.point;
            p.y += transform.localScale.y;
        }
        return p;
    }
    private void CommitPosition()
    {
        Vector3 mousePos = Input.mousePosition;
        Ray touchPointToRay = mainCamera.ScreenPointToRay(mousePos);
        if (Physics.Raycast(touchPointToRay, out hit, Mathf.Infinity, ~(1 << 8)))
        {
            GameObject tile = hit.collider.gameObject;
            if (tile.CompareTag("Tile"))
            {
                int x = (int)tile.transform.position.x;
                int z = (int)tile.transform.position.z;
                if (board.canMove(this) && board.canPut(x, z, this))
                {
                    board.move(x, z, this);
                    nowPos = tile.transform.position;
                    nowPos.y = transform.localScale.y + hit.point.y;
                }

            }
        }
        transform.position = nowPos;
    }
}
