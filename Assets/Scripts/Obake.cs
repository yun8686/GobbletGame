using UnityEngine;
using UnityEngine.EventSystems;

public class Obake : MonoBehaviour
{
    private Vector3 nowPos;

    private bool isMoving = false;
    private Camera mainCamera;
    private RaycastHit hit;

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
            isMoving = true;
            gameObject.layer = LayerMask.NameToLayer("Ignore Raycast");
        }
        else
        {
            isMoving = false;
            gameObject.layer = LayerMask.NameToLayer("Default");
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
        if (Physics.Raycast(touchPointToRay, out hit))
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
        if (Physics.Raycast(touchPointToRay, out hit))
        {
            GameObject tile = hit.collider.gameObject;
            if (tile.CompareTag("Tile"))
            {
                nowPos = tile.transform.position;
                nowPos.y = transform.localScale.y+hit.point.y;
            }
        }
        transform.position = nowPos;
    }
}
